import { Html, useProgress } from '@react-three/drei';
import React from 'react';

export default function LoaderTHREE() {
  // eslint-disable-next-line no-unused-vars
  const { active, progress, errors, item, loaded, total } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}
