import React from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import * as THREE from 'three';

import Model from './Model';
import { PerspectiveCamera } from '@react-three/drei';

const ViewerContainer = styled.div`
  width: 100%;
  top: -3rem;
  height: 100%;
  position: absolute;
  z-index: -5;
`;

const cameraOpts = {
  fov: 45,
  near: 0.0001,
  far: 100000,
  position: [200, 200, 0]
};

const onCanvasCreated = ({ gl }) => {
  /* eslint no-param-reassign: "error" */
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFShadowMap;
  // gl.gammaOutput = true;
  // gl.gammaFactor = 2.2;
  gl.toneMappingExposure = 1.0;
  /* eslint-env browser */
  gl.setPixelRatio(window.devicePixelRatio);
};

const CanvasBG = () => {
  return (
    <ViewerContainer>
      <Canvas
        camera={cameraOpts}
        //   pixelRatio={window.devicePixelRatio}
        onCreated={onCanvasCreated}
      >
        <pointLight
          visible
          intensity={1}
          debug
          color="white"
          position={[0, 200, 0]}
          rotation={[Math.PI / -2.5, 0, 0]}
        />
        <PerspectiveCamera
          makeDefault
          // renderOrder={'YXZ'}
          far={300}
          near={0.1}
          fov={45}
          zoom={8}
          position={[0, 0, 20]}
          // rotation={[0, 0, 0]}
        >
          <ambientLight color={'white'} intensity={0.5} />
          <directionalLight position={[10, 20, 15]} intensity={0.5} />
        </PerspectiveCamera>
        <Model />
      </Canvas>
    </ViewerContainer>
  );
};

export default CanvasBG;
