import chroma from "chroma-js";
import * as StackBlur from "stackblur-canvas";
import { type FinderSettings } from "./settings";

const FINDERSETTINGS: FinderSettings = {
  sampleCount: 10, //10,
  minSampleDistance: 10, //20,
  maxSampleDistance: 80, //100,
  minDistanceFromWhite: 30, //30,
  minDistanceFromBlack: 20, //20,
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
  dataCanvas.width =
    image.naturalWidth > image.naturalHeight
      ? image.naturalHeight
      : image.naturalWidth;
  dataCanvas.height = dataCanvas.width;

  // Render then blur the image on the canvas
  image.crossOrigin = "anonymous";
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
  let samples = takeSamples(image);

  // Filter colors by settings
  const filteredSamples = [];
  const filterSamples = () => {
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
          visualColorDistance(samples[i], samples[i + 1]) >
            FINDERSETTINGS.minSampleDistance)
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
          filteredSamples.push(samples[i]);
        }
      }
    }
  };

  filterSamples();

  // Try blurring the image less
  if (filteredSamples.length < 10) {
    console.log("INSANE BLUR");
    FINDERSETTINGS.blurAmmount = 40;
    samples = takeSamples(image);
    filterSamples();
    console.info(
      `Reduced ${samples.length} samples -> ${filteredSamples.length}`,
    );
  }

	// Try the opposite
  if (filteredSamples.length < 10) {
    console.log("LOWWWWWW BLUR");
    FINDERSETTINGS.blurAmmount = 0;
    samples = takeSamples(image);
    filterSamples();
    console.info(
      `Reduced ${samples.length} samples -> ${filteredSamples.length}`,
    );
  }

  // If the image is too white or black, reduce black / white distance
  if (filteredSamples.length < 2) {
    console.log("TOO BLACK OR WHITE?");
    FINDERSETTINGS.minDistanceFromBlack = 10;
    FINDERSETTINGS.minDistanceFromWhite = 10;
    filterSamples();
    console.info(
      `Reduced ${samples.length} samples -> ${filteredSamples.length}`,
    );
  }

  // If the image is SUPER white or black, reduce black / white distance
  if (filteredSamples.length < 2) {
    console.log("SUPER BLACK OR WHITE");
    FINDERSETTINGS.minDistanceFromBlack = 0;
    FINDERSETTINGS.minDistanceFromWhite = 0;
    filterSamples();
    console.info(
      `Reduced ${samples.length} samples -> ${filteredSamples.length}`,
    );
  }

  console.info(
    `Reduced ${samples.length} samples -> ${filteredSamples.length}`,
  );

  // Get best colors for the gradient
  let greatestDist = 0;
  const bestGradient = [];

  const chooseGradientColors = () => {
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
  };

  chooseGradientColors();

  // If image is SUPER white / black, find most contrasting colors and then change their luminance
  if (bestGradient.length < 2) {
    FINDERSETTINGS.minSampleDistance = 5;
    FINDERSETTINGS.maxSampleDistance = 100;
    console.log("LOWER SAMPLE DISTANCE");
    chooseGradientColors();
  }

	// STILL? JEEZE
  if (bestGradient.length < 2) {
    FINDERSETTINGS.minSampleDistance = 0;
    FINDERSETTINGS.maxSampleDistance = 100;
    console.log("LOWER SAMPLE DISTANCE");
    chooseGradientColors();
  }

  // reset FINDERSETTINGS
  FINDERSETTINGS.sampleCount = 10;
  FINDERSETTINGS.minSampleDistance = 10;
  FINDERSETTINGS.maxSampleDistance = 80;
  FINDERSETTINGS.minDistanceFromWhite = 30;
  FINDERSETTINGS.minDistanceFromBlack = 20;
	FINDERSETTINGS.blurAmmount = 10;

  return [colorToRGBStr(bestGradient[0]), colorToRGBStr(bestGradient[1])];
};

export const findColorScheme = (image: HTMLImageElement) => {
  const gradient = findGradient(image);

	// find darkest and lightest colors
  let darkest, lightest;
  if (chroma(gradient[0]).luminance() <= chroma(gradient[1]).luminance()) {
    darkest = gradient[0];
    lightest = gradient[1];
  } else {
    darkest = gradient[1];
    lightest = gradient[0];
  }

	// modify colors based on contrast
	const separateColors = (colorA, colorB) => {
		if (chroma.contrast(colorA, colorB) < 1.5) {
			return separateColors(chroma(colorA).darken(), chroma(colorB).brighten());
		}

		return [colorA, colorB];
	}

	const separatedColors = separateColors(darkest, lightest);
	darkest = separatedColors[0];
	lightest = separatedColors[1];

  return {
    textColor: "white",
    backgroundColor: darkest,
    hoverColor: colorToRGBStr(
      new Uint8ClampedArray(
        chroma(lightest)
          .luminance(chroma(lightest).luminance() + 0.2, "lab")
          .rgba(),
      ),
    ),
    gradientColorA: gradient[0],
    gradientColorB: gradient[1],
    playBarForegroundColor: lightest,
    playBarBackgroundColor: colorToRGBStr(
      new Uint8ClampedArray(
        chroma(darkest).luminance(chroma(darkest).luminance(), "lab").rgba(),
      ),
    ),
  };
};
