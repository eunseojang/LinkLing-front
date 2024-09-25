import React, { useEffect, useRef, useState } from "react";
import "./TestPage.css";

const TestPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const container = document.querySelector("#unity-container") as HTMLElement;
    const canvas = canvasRef.current;
    const loadingBar = document.querySelector(
      "#unity-loading-bar"
    ) as HTMLElement;
    const progressBarFull = document.querySelector(
      "#unity-progress-bar-full"
    ) as HTMLElement;
    const fullscreenButton = document.querySelector(
      "#unity-fullscreen-button"
    ) as HTMLElement;
    const warningBanner = document.querySelector(
      "#unity-warning"
    ) as HTMLElement;

    // Shows a temporary message banner/ribbon for a few seconds, or
    // a permanent error message on top of the canvas if type=='error'.
    // If type=='warning', a yellow highlight color is used.
    function unityShowBanner(msg: string, type: string) {
      function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length
          ? "block"
          : "none";
      }
      const div = document.createElement("div");
      div.innerHTML = msg;
      warningBanner.appendChild(div);
      if (type === "error") div.style.background = "red";
      else if (type === "warning") div.style.background = "yellow";

      setTimeout(() => {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
      updateBannerVisibility();
    }

    const buildUrl = "Build";
    const loaderUrl = `${buildUrl}/realbuild.loader.js`;
    const config = {
      dataUrl: `${buildUrl}/realbuild.data`,
      frameworkUrl: `${buildUrl}/realbuild.framework.js`,
      codeUrl: `${buildUrl}/realbuild.wasm`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "multi-game-test",
      productVersion: "0.1",
      showBanner: unityShowBanner,
    };

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes";
      document.getElementsByTagName("head")[0].appendChild(meta);
      container.className = "unity-mobile";
      if (canvas) canvas.className = "unity-mobile";
    } else {
      if (canvas) {
        canvas.style.width = "100vw"; // 전체 화면 너비
        canvas.style.height = "100vh"; // 전체 화면 높이
      }
    }

    if (loadingBar) loadingBar.style.display = "block";

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
      if (canvas) {
        (window as any)
          .createUnityInstance(canvas, config, (progress: number) => {
            setLoadingProgress(progress * 100);
            if (progressBarFull)
              progressBarFull.style.width = `${100 * progress}%`;
          })
          .then((unityInstance: any) => {
            if (loadingBar) loadingBar.style.display = "none";
            if (fullscreenButton)
              fullscreenButton.onclick = () => {
                unityInstance.SetFullscreen(1);
              };
          })
          .catch((message: any) => {
            alert(message);
          });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div id="unity">
      <div id="unity-container" className="unity-desktop">
        <canvas
          ref={canvasRef}
          id="unity-canvas"
          width="960"
          height="600"
          tabIndex={-1}
        ></canvas>
        <div id="unity-loading-bar">
          <div id="unity-logo"></div>
          <div id="unity-progress-bar-empty">
            <div
              id="unity-progress-bar-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
        <div id="unity-warning"></div>
        <div id="unity-footer">
          <div id="unity-webgl-logo"></div>
          <div id="unity-fullscreen-button"></div>
          <div id="unity-build-title">multi-game-test</div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
