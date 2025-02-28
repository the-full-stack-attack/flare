import React, { useCallback } from 'react';
import Particles from 'react-particles'
import type { Engine } from 'tsparticles-engine';
import { loadFireworksPreset } from 'tsparticles-preset-fireworks';

function Fireworks() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFireworksPreset(engine);
}, [])

const particlesConfig={
    preset: "fireworks",
}
return ( <Particles
  init={particlesInit}
  options={particlesConfig}
/>
)
}
export default Fireworks;
