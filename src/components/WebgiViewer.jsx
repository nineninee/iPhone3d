import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react'
import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  GammaCorrectionPlugin,
  mobileAndTabletCheck,
  addBasePlugins
} from "webgi";
import gasp from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollAnimation } from '../lib/scrolll-animation';

gasp.registerPlugin(ScrollTrigger)

const WebgiViewer = forwardRef((props, ref) => {

  const canvasRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const [viewerRef, setViewerRef] = useState(null)
  const [targetRef, setTargetRef] = useState(null)
  const [cameraRef, setCameraRef] = useState(null)
  const [positionRef, setPositionRef] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)


  useImperativeHandle(ref, () => ({
    triggerPreview() {

      setPreviewMode(true)

      canvasContainerRef.current.style.pointerEvents = 'all';

      props.contentRef.current.style.opacity = '0'

      gasp.to(positionRef, {
        x: 13.04,
        y: -2.01,
        z: 2.29,
        duration: 2,
        onUpdate: () => {
          viewerRef.setDirty()
          cameraRef.positionTargetUpdated(true)
        }
      })

      gasp.to(targetRef, { x: 0.11, y: 0.0, z: 0.0, duration: 2 })
      
      viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true})
    }
  }))

  const memorizedScrollAnimation = useCallback(
    (position, target, onUpdate) => {
      if (position && target && onUpdate) {
        scrollAnimation(position, target, onUpdate)
      }
    }, []
  )

  const setupViewer = useCallback(async () => {
    {
      // Initialize the viewer
      const viewer = new ViewerApp({
        // canvas: document.getElementById('webgi-canvas'),
        canvas: canvasRef.current,
      })

      setViewerRef(viewer)
  
      // Add some plugins
      const manager = await viewer.addPlugin(AssetManagerPlugin)

      const camera = viewer.scene.activeCamera
      const position = camera.position
      const target = camera.target

      setCameraRef(camera)
      setPositionRef(position)
      setTargetRef(target)
  
      // Add plugins individually.
      await viewer.addPlugin(GBufferPlugin)
      await viewer.addPlugin(new ProgressivePlugin(32))
      await viewer.addPlugin(new TonemapPlugin(true))
      await viewer.addPlugin(GammaCorrectionPlugin)
      await viewer.addPlugin(SSRPlugin)
      await viewer.addPlugin(SSAOPlugin)
      await viewer.addPlugin(BloomPlugin)

      // This must be called once after all plugins are added.
      viewer.renderer.refreshPipeline()
  
      // Import and add a GLB file.
      // await viewer.load("/scene-black.glb")
      await manager.addFromPath("scene-black.glb")
    
      viewer.getPlugin(TonemapPlugin).config.clipBackground = true
  
      viewer.scene.activeCamera.setCameraOptions({
        controlsEnabled: false
      })

      window.scrollTo(0, 0)

      let needsUpdate = true

      const onUpdate = () => {
        needsUpdate = true
        viewer.setDirty()
      }

      viewer.addEventListener('preFrame', () => {
        if (needsUpdate) {
          camera.positionTargetUpdated(true)
          needsUpdate = false
        }
      })

     memorizedScrollAnimation(position, target, onUpdate)
    }

  }, [])

  useEffect(() => {
    setupViewer()
  }, [])

  const handleExit = useCallback(() => {
    canvasContainerRef.current.style.pointerEvents = 'none'
    props.contentRef.current.style.opacity = '1'
    viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false })
    setPreviewMode(false)

    gasp.to(positionRef, {
      x: 1.56,
      y: 5.0,
      z: 0.011,
      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top  top',
        scrub: 2,
        immediateRender: false
      },
      onUpdate: () => {
        viewerRef.setDirty()
        cameraRef.positionTargetUpdated(true)
      }
    })
    gasp.to(targetRef, {
      x: -0.55,
      y: 0.32,
      z: 0.0,
      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top  top',
        scrub: 2,
        immediateRender: false
      }
    })
  }, [canvasContainerRef, viewerRef, cameraRef, positionRef, targetRef])

  return (
    <div id='webgi-canvas-container' ref={canvasContainerRef}>
      <canvas id='webgi-canvas' ref={canvasRef} />
      {
        previewMode && (
          <button className="button" onClick={handleExit}>Exit</button>
        )
      }
    </div>
  )
})

export default WebgiViewer