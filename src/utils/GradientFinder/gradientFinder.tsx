import chroma from "chroma-js";
import * as StackBlur from "stackblur-canvas";
import { type FinderSettings } from "./settings";

const FINDERSETTINGS: FinderSettings = {
  sampleCount: 10, //10,
  minSampleDistance: 10, //20,
  maxSampleDistance: 80, //100,
  minDistanceFromWhite: 10, //30,
  minDistanceFromBlack: 10, //20,
  lightMode: false,
  darkMode: false,
  blurAmmount: 10,
};

const colorToRGBStr = (color: Uint8ClampedArray): string => {
  if (color) {
    return `rgb(${color[0]},${color[1]},${color[2]})`;
  }

  return `rgb(255,255,255)`;
};

const visualColorDistance = (
  colorA: Uint8ClampedArray,
  colorB: Uint8ClampedArray,
): number => {
  return chroma.deltaE(colorToRGBStr(colorA), colorToRGBStr(colorB));
};

const takeSamples = (image: HTMLImageElement) => {
  // Create the canvas we will be pulling data from
  const dataCanvas = document.createElement("canvas");
  const dataContext = dataCanvas.getContext("2d")!;
  dataCanvas.width = image.naturalWidth > image.naturalHeight ? image.naturalHeight : image.naturalWidth;
  dataCanvas.height = dataCanvas.width;

  // Render then blur the image on the canvas
  dataContext.drawImage(image, 0, 0, dataCanvas.width, dataCanvas.height);
  StackBlur.canvasRGB(
    dataCanvas,
    0,
    0,
    dataCanvas.width,
    dataCanvas.height,
    FINDERSETTINGS.blurAmmount,
  );

  // Take samples of the blurred image
  const samples = [];
  for (let i = 0; i < FINDERSETTINGS.sampleCount; i++) {
    for (let j = 0; j < FINDERSETTINGS.sampleCount; j++) {
      const currentSample = dataContext.getImageData(
        i * (dataCanvas.width / FINDERSETTINGS.sampleCount) +
          dataCanvas.width / FINDERSETTINGS.sampleCount / 2,
        j * (dataCanvas.width / FINDERSETTINGS.sampleCount) +
          dataCanvas.width / FINDERSETTINGS.sampleCount / 2,
        1,
        1,
      ).data;

      samples.push(currentSample);
    }
  }

  return samples;
};

export const findGradient = (image: HTMLImageElement) => {
  const samples = takeSamples(image);

  // Filter colors by settings
  const filteredSamples = [];
  console.log(samples);
  for (let i = 0; i < samples.length; i++) {
    // This logical nightmare needs to be fixed
    let invalidColor = false;
    if (
      visualColorDistance(
        samples[i],
        new Uint8ClampedArray([255, 255, 255, 1]),
      ) <= FINDERSETTINGS.minDistanceFromWhite ||
      visualColorDistance(samples[i], new Uint8ClampedArray([0, 0, 0, 1])) <=
        FINDERSETTINGS.minDistanceFromBlack ||
      (i != samples.length - 1 &&
        visualColorDistance(samples[i], samples[i + 1]) > FINDERSETTINGS.minSampleDistance)
    ) {
      invalidColor = true;
    }

    if (!invalidColor) {
      if (
        FINDERSETTINGS.lightMode &&
        chroma(colorToRGBStr(samples[i])).luminance() >= 0.75
      ) {
        filteredSamples.push(samples[i]);
      } else if (
        FINDERSETTINGS.darkMode &&
        chroma(colorToRGBStr(samples[i])).luminance() <= 0.25
      ) {
        filteredSamples.push(samples[i]);
      } else if (!FINDERSETTINGS.lightMode && !FINDERSETTINGS.darkMode) {
        console.log("SAMPLE ADDED");
        filteredSamples.push(samples[i]);
      }
    }
  }

  console.info(
    `Reduced ${samples.length} samples -> ${filteredSamples.length}`,
  );

  // Get best colors for the gradient
  let greatestDist = 0;
  const bestGradient = [new Uint8ClampedArray(3), new Uint8ClampedArray(3)];
  for (const sampleA of filteredSamples) {
    for (const sampleB of filteredSamples) {
      // Check if samples are the same
      if (!sampleA.every((v, i) => v === sampleB[i])) {
        const dist = visualColorDistance(sampleA, sampleB);
        if (
          dist >= FINDERSETTINGS.minSampleDistance &&
          dist <= FINDERSETTINGS.maxSampleDistance &&
          dist > greatestDist
        ) {
          greatestDist = dist;
          bestGradient[0] = sampleA;
          bestGradient[1] = sampleB;
        }
      }
    }
  }

  return [colorToRGBStr(bestGradient[0]), colorToRGBStr(bestGradient[1])];
};

// export const findColorScheme = (image: HTMLImageElement) => {};
