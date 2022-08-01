import { useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader';
import * as THREE from 'three';

const guiData = {
  displayLines: true,
  conditionalLines: true,
  smoothNormals: true,
  constructionStep: 0,
  noConstructionSteps: 'No steps.',
  flatColors: false,
  mergeModel: false
};

export default function Model(props) {
  const obj = useLoader(LDrawLoader, props.url, (loader) => {
    loader.setPath('/assets/');
    loader.setPartsLibraryPath('/assets/');
  });

  const t = useThree();

  console.log(t);

  const mesh = useRef(null);
  obj.rotation.z = Math.PI / 2;
  obj.rotation.x = Math.PI / 2;
  obj.rotation.y = Math.PI / 2;
  obj.scale.set(0.2, 0.2, 0.2);
  // useEffect(() => {
  //   console.log(mesh.current);
  // });

  // useFrame((state, delta) => {
  //   mesh.current.rotation.z -= 0.01;
  // });
  const bbox = new THREE.Box3().setFromObject(obj);
  const size = bbox.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, Math.max(size.y, size.z)) * 0.3;

  t.camera.position.set(-2.3, 1, 2).multiplyScalar(radius);

  useEffect(() => {
    // const plane = new THREE.PlaneBufferGeometry(500, 500);
    // const red = new THREE.MeshBasicMaterial({
    //   color: '#ff0000',
    //   toneMapped: false
    // });

    // const planeMesh = new THREE.Mesh(plane, red);
    // planeMesh.rotation.x = -Math.PI / 2;
    // planeMesh.position.y = -radius;
    // planeMesh.name = 'floor';
    // t.scene.add(planeMesh);

    guiData.constructionStep = 0;
    if (obj) create();
    return function () {
      t.scene.remove(obj);
    };
  }, [obj, t.scene]);

  updateObjectsVisibility();

  function updateObjectsVisibility() {
    obj.traverse((c) => {
      if (c.isLineSegments) {
        if (c.isConditionalLine) {
          c.visible = guiData.conditionalLines;
        } else {
          c.visible = guiData.displayLines;
        }
      } else if (c.isGroup) {
        // Hide objects with construction step > gui setting
        c.visible = c.userData.constructionStep <= guiData.constructionStep;
      }
    });
  }
  function create() {
    setTimeout(() => {
      if (guiData.constructionStep < obj.userData.numConstructionSteps - 1) {
        guiData.constructionStep++;
        updateObjectsVisibility();
        create();
      }
    }, 2000 / obj.userData.numConstructionSteps);
  }

  return (
    <>
      <primitive object={obj} ref={mesh} position={[0, 0, 0]} />
    </>
  );
}
