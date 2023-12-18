import * as BABYLON from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

window.engine = null;
window.scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
    return engine;
};

class Playground {
    static async CreateScene(engine, canvas) {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new BABYLON.Scene(engine);

        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: 'immersive-ar'
            }
        });

        scene.createDefaultCameraOrLight(true, true, true);
        scene.createDefaultEnvironment({
            createSkybox: false
        });
        // scene.clearColor = new BABYLON.Color4(0, 0, 0.05, 1);
        // scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        BABYLON.SceneLoader.Append("models/ford_mustang_2015_edition/", "scene.gltf", scene, function (scene) {
        });

        const camera = scene.activeCamera;
        camera.alpha = -0.69;
        camera.beta = 1.198;
        camera.radius = 5.25;

        xr.camera.alpha = -0.69;
        xr.camera.beta = 1.198;
        xr.camera.radius = 5.25;

        const environmentLight = new BABYLON.HemisphericLight('environmentLight', new BABYLON.Vector3(0, 1, 0), scene);
        environmentLight.intensity = 0.5;
        environmentLight.diffuse = new BABYLON.Color3(1, 1, 1);
        environmentLight.specular = new BABYLON.Color3(1, 1, 1);
        environmentLight.groundColor = new BABYLON.Color3(1, 1, 1);
        // scene.freezeActiveMeshes();
        // Inspector.Show(scene, {});

        return scene;
    }
}

const createScene = function () {
    return Playground.CreateScene(engine, engine.getRenderingCanvas());
}

window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!window.engine) throw 'engine should not be null.';
    startRenderLoop(window.engine, canvas);
    window.scene = await createScene();
};

initFunction().then(() => {
    sceneToRender = window.scene
});

// Resize
window.addEventListener("resize", function () {
    window.engine.resize();
});