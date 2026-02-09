import { HTML } from '@use-gpu/react'
import { AutoCanvas, WebGPU } from '@use-gpu/webgpu'
import { Pass, FullScreen, Clock } from '@use-gpu/workbench'
import '@use-gpu/inspect/theme.css'

import { makeFallback } from './LiveFallback'

// Can import .wgsl directly as module
import { main } from '../../wgsl/background.wgsl'
console.log(main)

type LiveBackgroundProps = {
  canvas: HTMLCanvasElement,
  zoom: number
}

export const LiveBackground = (props: LiveBackgroundProps) => {
  let zoom = window.devicePixelRatio * 0.5;
  return (
    <WebGPU fallback={(error: Error) => <HTML>{makeFallback(error)}</HTML>}>
      <AutoCanvas canvas={props.canvas} samples={4}>
        <Pass>
          <Clock
            start={0.0}
            speed={0.2}
            render={(time) => <FullScreen shader={main} args={[zoom, time]} />}
          />
        </Pass>
      </AutoCanvas>
    </WebGPU>
  )
}