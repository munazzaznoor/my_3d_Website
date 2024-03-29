import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js"
import * as dat from 'dat.gui' 
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
const scene = new THREE.Scene();
console.log(scene)
const gui = new dat.GUI()
const world = { 
  plane : {
    width: 19,
    height : 19,
    widthSegments : 54,
    heightSegments : 54
  }
}
gui.add(world.plane,'width', 1, 20).onChange(generatePlane)
gui.add(world.plane,'height', 1, 20).onChange(generatePlane)
gui.add(world.plane,'widthSegments', 1, 200).onChange(generatePlane)
gui.add(world.plane,'heightSegments', 1, 200).onChange(generatePlane)


const camera =new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000)
const renderer = new THREE.WebGLRenderer()
const raycaster = new THREE.Raycaster()

renderer.setSize(innerWidth,innerHeight)
document.body.appendChild(renderer.domElement)

const boxGeometry =new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color : 0x00FF00})
const mesh =new THREE.Mesh(boxGeometry,material)
scene.add(mesh)
new OrbitControls(camera, renderer.domElement)
camera.position.z=5
const planeGeometry=new THREE.PlaneGeometry(5,5,10,10)
const planeMaterial = new THREE.MeshPhongMaterial({side : THREE.DoubleSide,
                                                  flatShading : THREE.FlatShading,
                                                  vertexColors : true
                                                  })
const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial)
scene.add(planeMesh)

const { array } = planeMesh.geometry.attributes.position

for(let i = 0; i<array.length; i += 3)
{
  const x = array[i]
  const y = array[i+1]
  const z = array[i+2]

  array[i + 2] = z + Math.random()
}

function generatePlane(){
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.
    PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )
  const { array } = planeMesh.geometry.attributes.position
  for(let i = 0; i<array.length; i += 3)
  {
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]

    array[i + 2] = z + Math.random()
  }
  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
  colors.push(0,0.19,0.4)
}


planeMesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors), 3))

}
const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
  colors.push(0,0.19,0.4)
}


planeMesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors), 3))

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

camera.position.z = 5
const mouse = {
  x : undefined,
  y : undefined
}

let mixer;
var bee;
// var animationloader = new FBXLoader();
var loader=new GLTFLoader();

loader.load( './assets/Racer walk.gltf', 
  function ( gltf ) {
    bee = gltf.scene;   
    scene.add(gltf.scene);
    bee.scale.set(0.1,0.1,0.1)
    bee.position.setY(-1.3)
    bee.position.setZ(2)
    mixer = new THREE.AnimationMixer(bee)
    const clips = gltf.animations;
    clips.forEach(function(clip){
      const action = mixer.clipAction(clip)
      action.play()
    }
    )
}, undefined, function ( error ) {

  console.error( error );

} );


const clock = new THREE.Clock()

function animate(){
  if(mixer)
    mixer.update(clock.getDelta());
  // requestAnimationFrame(animate)

  renderer.render(scene,camera)

  raycaster.setFromCamera(mouse,camera)
  const intersects = raycaster.intersectObject(planeMesh)
  if(intersects.length > 0){
    const { color } = intersects[0].object.geometry.attributes

    color.setX(intersects[0].face.a,0.1)
    color.setY(intersects[0].face.a,0.5)
    color.setZ(intersects[0].face.a,1)


    color.setX(intersects[0].face.b,0.1)
    color.setY(intersects[0].face.b,0.5)
    color.setZ(intersects[0].face.b,1)


    color.setX(intersects[0].face.c,0.1)
    color.setY(intersects[0].face.c,0.5)
    color.setZ(intersects[0].face.c,1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true
    const initialColor = {
      r : 0,
      g : 0.19,
      b : 0.4
    }
    const hoverColor = {
      r : 0.1,
      g : 0.5,
      b : 1
    }
    gsap.to(hoverColor, {
      r : initialColor.r,
      g : initialColor.g,
      b : initialColor.b,
      onUpdate : ()=>{
        color.setX(intersects[0].face.a,hoverColor.r)
        color.setY(intersects[0].face.a,hoverColor.g)
        color.setZ(intersects[0].face.a,hoverColor.b)


        color.setX(intersects[0].face.b,hoverColor.r)
        color.setY(intersects[0].face.b,hoverColor.g)
        color.setZ(intersects[0].face.b,hoverColor.b)


        color.setX(intersects[0].face.c,hoverColor.r)
        color.setY(intersects[0].face.c,hoverColor.g)
        color.setZ(intersects[0].face.c,hoverColor.b)
      }
    })

  }



  
  // bee.rotation.x += 0.01
  // bee.rotation.y += 0.01
  // bee.rotation.z += 0.01
  //planeMesh.rotation.x += 0.01

}

addEventListener('mousemove',(event) =>
  {
  mouse.x = (event.clientX/innerWidth) * 2  - 1
  mouse.y = -(event.clientY/innerHeight) * 2 + 1
  }
  )
animate()

renderer.setAnimationLoop(animate)
