import chroma from "chroma-js";
import * as StackBlur from "stackblur-canvas";
import { type FinderSettings } from "./settings";

const DEBUGON = false;

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
  dataCanvas.id = "DATA";
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

  if (DEBUGON) {
    if (document.getElementById("DATA")) {
      document.getElementById("DATA").remove();
    }

		dataCanvas.style.marginRight = "80px";
    document.body.appendChild(dataCanvas);
  }

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

      if (DEBUGON) {
        let invalidColor = false;
        if (
          visualColorDistance(
            currentSample,
            new Uint8ClampedArray([255, 255, 255, 1]),
          ) <= FINDERSETTINGS.minDistanceFromWhite ||
          visualColorDistance(
            currentSample,
            new Uint8ClampedArray([0, 0, 0, 1]),
          ) <= FINDERSETTINGS.minDistanceFromBlack
        ) {
          invalidColor = true;
        }

        dataContext.fillStyle = colorToRGBStr(currentSample);
        dataContext.strokeStyle = invalidColor ? "red" : "lime";
        dataContext.fillRect(
          i * (dataCanvas.width / FINDERSETTINGS.sampleCount) +
            dataCanvas.width / FINDERSETTINGS.sampleCount / 2 -
            20,
          j * (dataCanvas.width / FINDERSETTINGS.sampleCount) +
            dataCanvas.width / FINDERSETTINGS.sampleCount / 2 -
            20,
          40,
          40,
        );
        dataContext.strokeRect(
          i * (dataCanvas.width / FINDERSETTINGS.sampleCount) +
            dataCanvas.width / FINDERSETTINGS.sampleCount / 2 -
            20,
          j * (dataCanvas.width / FINDERSETTINGS.sampleCount) +
            dataCanvas.width / FINDERSETTINGS.sampleCount / 2 -
            20,
          40,
          40,
        );
      }

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
          chroma(colorToRGBStr(samples[i])).luminance() <= 0.05
        ) {
          filteredSamples.push(samples[i]);
        } else if (!FINDERSETTINGS.lightMode && !FINDERSETTINGS.darkMode) {
          filteredSamples.push(samples[i]);
        }
      }
    }
  };

  filterSamples();

  const unmodifiedFinderSettings = structuredClone(FINDERSETTINGS);

  // Try blurring the image less
  if (filteredSamples.length < 2) {
    FINDERSETTINGS.blurAmmount = 40;
    samples = takeSamples(image);
    filterSamples();

    Object.keys(unmodifiedFinderSettings).forEach(
      (key) => (FINDERSETTINGS[key] = unmodifiedFinderSettings[key]),
    );

    if (DEBUGON) {
      console.log("Blurring the image less...");
    }
  }

  // Try no blur
  if (filteredSamples.length < 2) {
    FINDERSETTINGS.blurAmmount = 0;
    samples = takeSamples(image);
    filterSamples();

    Object.keys(unmodifiedFinderSettings).forEach(
      (key) => (FINDERSETTINGS[key] = unmodifiedFinderSettings[key]),
    );

    if (DEBUGON) {
      console.log("Removing the image blur...");
    }
  }

  // If the image is too white or black, reduce black / white distance
  if (filteredSamples.length < 2) {
    FINDERSETTINGS.minDistanceFromBlack = 10;
    FINDERSETTINGS.minDistanceFromWhite = 5;
    filterSamples();

    Object.keys(unmodifiedFinderSettings).forEach(
      (key) => (FINDERSETTINGS[key] = unmodifiedFinderSettings[key]),
    );

    if (DEBUGON) {
      console.log("Reducing black / white distance...");
    }
  }

  // If the image is SUPER white or black, reduce black / white distance
  if (filteredSamples.length < 2) {
    FINDERSETTINGS.minDistanceFromBlack = 0;
    FINDERSETTINGS.minDistanceFromWhite = 0;
    filterSamples();

    Object.keys(unmodifiedFinderSettings).forEach(
      (key) => (FINDERSETTINGS[key] = unmodifiedFinderSettings[key]),
    );

    if (DEBUGON) {
      console.log("Black / white distance set to 0...");
    }
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
    FINDERSETTINGS.minSampleDistance = 10;
    FINDERSETTINGS.maxSampleDistance = 80;
    chooseGradientColors();

    Object.keys(unmodifiedFinderSettings).forEach(
      (key) => (FINDERSETTINGS[key] = unmodifiedFinderSettings[key]),
    );

    if (DEBUGON) {
      console.log("Increasing allowed sample difference...");
    }
  }

  // STILL? JEEZE
  if (bestGradient.length < 2) {
    FINDERSETTINGS.minSampleDistance = 0;
    FINDERSETTINGS.maxSampleDistance = 100;
    chooseGradientColors();

    Object.keys(unmodifiedFinderSettings).forEach(
      (key) => (FINDERSETTINGS[key] = unmodifiedFinderSettings[key]),
    );

    if (DEBUGON) {
      console.log("Set sample difference to max...");
    }
  }

  return [colorToRGBStr(bestGradient[0]), colorToRGBStr(bestGradient[1])];
};

export const findColorScheme = (image: HTMLImageElement) => {
  const gradient = findGradient(image);

  // find darkest and lightest colors
  let darkest: string, lightest: string;
  if (chroma(gradient[0]).luminance() <= chroma(gradient[1]).luminance()) {
    darkest = gradient[0];
    lightest = gradient[1];
  } else {
    darkest = gradient[1];
    lightest = gradient[0];
  }

  // normalize if white / black
  if (chroma(darkest).luminance() < 0.009) {
    darkest = colorToRGBStr(
      new Uint8ClampedArray(chroma(darkest).luminance(0.02, "lab").rgba()),
    );
  }
  if (chroma(darkest).luminance() > 0.9) {
    darkest = colorToRGBStr(
      new Uint8ClampedArray(chroma(darkest).luminance(0.8, "lab").rgba()),
    );
  }
  if (chroma(lightest).luminance() < 0.009) {
    lightest = colorToRGBStr(
      new Uint8ClampedArray(chroma(lightest).luminance(0.02, "lab").rgba()),
    );
  }
  if (chroma(lightest).luminance() > 0.9) {
    lightest = colorToRGBStr(
      new Uint8ClampedArray(chroma(lightest).luminance(0.8, "lab").rgba()),
    );
  }

  // modify colors based on contrast
  const separateColors = (colorA, colorB) => {
    if (typeof colorA !== "string") {
      colorA = colorToRGBStr(colorA);
    }

    if (typeof colorB !== "string") {
      colorB = colorToRGBStr(colorB);
    }

    if (chroma.contrast(colorA, colorB) < 1.5) {
      console.log("Separating lightest and darkest colors...");
      return separateColors(
        chroma(colorA).darken().rgba(),
        chroma(colorB).brighten().rgba(),
      );
    }

    return [colorA, colorB];
  };

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
    gradientColorA: lightest,
    gradientColorB: darkest,
    playBarForegroundColor: lightest,
    playBarBackgroundColor: darkest,
  };
};
