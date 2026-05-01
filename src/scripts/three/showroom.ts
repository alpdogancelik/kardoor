import * as THREE from "three";

type ShowroomCollection = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  modelCodes: string[];
  accentColor: string;
  image: string;
};

type DoorRecord = {
  collection: ShowroomCollection;
  group: THREE.Group;
  hitbox: THREE.Mesh;
  index: number;
  focus: THREE.Vector3;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseShowroomData = (root: HTMLElement): ShowroomCollection[] => {
  const dataNode = root.querySelector<HTMLScriptElement>("[data-showroom-data]");
  if (!dataNode?.textContent) return [];

  try {
    return JSON.parse(dataNode.textContent) as ShowroomCollection[];
  } catch {
    return [];
  }
};

const makeLabelTexture = (collection: ShowroomCollection) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 384;

  const context = canvas.getContext("2d");
  if (!context) return null;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(3, 8, 14, 0.82)";
  context.strokeStyle = collection.accentColor;
  context.lineWidth = 4;
  context.beginPath();
  context.roundRect(24, 24, 976, 336, 28);
  context.fill();
  context.stroke();

  context.fillStyle = collection.accentColor;
  context.font = "800 42px Barlow, Arial, sans-serif";
  context.letterSpacing = "8px";
  context.fillText(`KOLEKSIYON ${collection.number}`, 72, 110);

  context.fillStyle = "#edf3fa";
  context.font = "400 92px 'Bebas Neue', Impact, Arial, sans-serif";
  context.letterSpacing = "0px";
  context.fillText(collection.shortTitle.toUpperCase(), 72, 224);

  context.fillStyle = "rgba(220, 232, 243, 0.72)";
  context.font = "700 34px Barlow, Arial, sans-serif";
  context.fillText(collection.modelCodes.join("   "), 72, 300);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
};

const createSoftBox = (
  width: number,
  height: number,
  depth: number,
  material: THREE.Material,
  radius = 0
) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (radius > 0) {
    mesh.userData.radius = radius;
  }

  return mesh;
};

class ShowroomController {
  private root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private collections: ShowroomCollection[];
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private textureLoader = new THREE.TextureLoader();
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private doors: DoorRecord[] = [];
  private keys = new Set<string>();
  private mobileMove = new Set<string>();
  private activeIndex = 0;
  private hoveredIndex = -1;
  private targetPosition = new THREE.Vector3(0, 1.62, 7.4);
  private yaw = 0;
  private pitch = -0.08;
  private targetYaw = 0;
  private targetPitch = -0.08;
  private dragging = false;
  private lastPointer = { x: 0, y: 0 };
  private animationFrame = 0;
  private lastTime = performance.now();
  private elapsed = 0;
  private resizeObserver?: ResizeObserver;

  constructor(root: HTMLElement, canvas: HTMLCanvasElement, collections: ShowroomCollection[]) {
    this.root = root;
    this.canvas = canvas;
    this.collections = collections;
    this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 80);
    this.camera.position.copy(this.targetPosition);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: new URLSearchParams(window.location.search).has("verifyCanvas"),
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
  }

  init() {
    this.buildScene();
    this.bindEvents();
    this.resize();
    this.focusDoor(0, false);
    this.animate();
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver?.disconnect();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("resize", this.resize);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("click", this.onCanvasClick);
    this.renderer.dispose();
  }

  private buildScene() {
    this.scene.background = new THREE.Color("#02060b");
    this.scene.fog = new THREE.FogExp2("#02060b", 0.038);

    const ambient = new THREE.HemisphereLight("#9fdcff", "#02060b", 0.62);
    this.scene.add(ambient);

    const mainLight = new THREE.DirectionalLight("#dce8f3", 1.3);
    mainLight.position.set(0, 7, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 32;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    this.scene.add(mainLight);

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: "#07111a",
      roughness: 0.38,
      metalness: 0.42
    });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 28), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const grid = new THREE.GridHelper(28, 28, "#1bd8f5", "#132635");
    grid.position.y = 0.012;
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.opacity = 0.18;
    gridMaterial.transparent = true;
    this.scene.add(grid);

    const backWallMaterial = new THREE.MeshStandardMaterial({
      color: "#06101a",
      roughness: 0.78,
      metalness: 0.16
    });
    const backWall = createSoftBox(24, 7.2, 0.22, backWallMaterial);
    backWall.position.set(0, 3.6, -8.2);
    this.scene.add(backWall);

    const sideWallMaterial = new THREE.MeshStandardMaterial({
      color: "#050b10",
      roughness: 0.84,
      metalness: 0.12
    });

    const leftWall = createSoftBox(0.22, 7.2, 19, sideWallMaterial);
    leftWall.position.set(-12, 3.6, 0.8);
    this.scene.add(leftWall);

    const rightWall = leftWall.clone();
    rightWall.position.x = 12;
    this.scene.add(rightWall);

    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: "#03070c",
      roughness: 0.8,
      metalness: 0.2
    });
    const ceiling = createSoftBox(28, 0.18, 20, ceilingMaterial);
    ceiling.position.set(0, 7.12, 0.2);
    this.scene.add(ceiling);

    this.createLightStrips();
    this.createDoorGallery();
  }

  private createLightStrips() {
    const stripMaterial = new THREE.MeshBasicMaterial({
      color: "#2ce3ff",
      transparent: true,
      opacity: 0.66
    });

    for (const x of [-5.8, 0, 5.8]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.035, 0.035), stripMaterial);
      strip.position.set(x, 6.94, -5.8);
      this.scene.add(strip);

      const light = new THREE.PointLight("#2ce3ff", 1.2, 9, 2.1);
      light.position.set(x, 5.8, -5.5);
      this.scene.add(light);
    }
  }

  private createDoorGallery() {
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: "#0b1825",
      roughness: 0.42,
      metalness: 0.46
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: "#102236",
      roughness: 0.46,
      metalness: 0.54
    });

    const positions = [
      new THREE.Vector3(-7.2, 0, -5.5),
      new THREE.Vector3(-4.25, 0, -6.65),
      new THREE.Vector3(-1.25, 0, -7.08),
      new THREE.Vector3(1.75, 0, -6.95),
      new THREE.Vector3(4.8, 0, -6.15),
      new THREE.Vector3(7.4, 0, -4.75)
    ];

    this.collections.forEach((collection, index) => {
      const group = new THREE.Group();
      const position = positions[index] ?? new THREE.Vector3((index - 2.5) * 2.7, 0, -6);
      group.position.copy(position);

      const angleToCenter = Math.atan2(-position.x, -position.z + 2.2);
      group.rotation.y = angleToCenter;

      const accent = new THREE.Color(collection.accentColor);

      const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.75, 0.22, 64), platformMaterial);
      platform.position.y = 0.11;
      platform.castShadow = true;
      platform.receiveShadow = true;
      group.add(platform);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.82, 3.62, 0.18), frameMaterial);
      frame.position.y = 2.02;
      frame.position.z = -0.08;
      frame.castShadow = true;
      frame.receiveShadow = true;
      group.add(frame);

      const haloMaterial = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const halo = new THREE.Mesh(new THREE.CircleGeometry(1.72, 96), haloMaterial);
      halo.position.set(0, 2.04, -0.19);
      group.add(halo);

      const doorMaterial = new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.52,
        metalness: 0.05,
        transparent: true,
        side: THREE.DoubleSide
      });

      const door = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 3.24), doorMaterial);
      door.position.y = 2.02;
      door.position.z = 0.025;
      door.castShadow = true;
      group.add(door);

      this.textureLoader.load(collection.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        doorMaterial.map = texture;
        doorMaterial.needsUpdate = true;
      });

      const labelTexture = makeLabelTexture(collection);
      if (labelTexture) {
        const labelMaterial = new THREE.MeshBasicMaterial({
          map: labelTexture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const label = new THREE.Mesh(new THREE.PlaneGeometry(2.75, 1.03), labelMaterial);
        label.position.set(0, 4.42, 0.02);
        group.add(label);
      }

      const glowMaterial = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.88
      });

      const verticalGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, 3.08, 0.035), glowMaterial);
      verticalGlow.position.set(-0.92, 2.02, 0.12);
      group.add(verticalGlow);

      const spot = new THREE.SpotLight(accent, 2.1, 8, Math.PI / 5, 0.58, 1.2);
      spot.position.set(0, 5.4, 1.6);
      spot.target.position.set(0, 1.9, 0);
      spot.castShadow = true;
      group.add(spot);
      group.add(spot.target);

      const hitbox = new THREE.Mesh(
        new THREE.BoxGeometry(2.25, 4.35, 0.75),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitbox.position.y = 2.18;
      hitbox.position.z = 0.06;
      hitbox.userData.index = index;
      group.add(hitbox);

      const focus = new THREE.Vector3(position.x * 0.45, 1.65, position.z + 6.4);
      this.scene.add(group);
      this.doors.push({ collection, group, hitbox, index, focus });
    });
  }

  private bindEvents() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.resize);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("click", this.onCanvasClick);

    this.root.querySelectorAll<HTMLButtonElement>("[data-showroom-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.showroomTarget ?? 0);
        this.focusDoor(index, true);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-showroom-move]").forEach((button) => {
      const move = button.dataset.showroomMove;
      if (!move) return;

      button.addEventListener("pointerdown", () => this.mobileMove.add(move));
      button.addEventListener("pointerup", () => this.mobileMove.delete(move));
      button.addEventListener("pointerleave", () => this.mobileMove.delete(move));
      button.addEventListener("pointercancel", () => this.mobileMove.delete(move));
    });

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.root);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    this.keys.add(event.code);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code);
  };

  private onPointerDown = (event: PointerEvent) => {
    this.dragging = true;
    this.lastPointer.x = event.clientX;
    this.lastPointer.y = event.clientY;
    this.canvas.setPointerCapture(event.pointerId);
  };

  private onPointerMove = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

    if (!this.dragging) return;

    const deltaX = event.clientX - this.lastPointer.x;
    const deltaY = event.clientY - this.lastPointer.y;
    this.lastPointer.x = event.clientX;
    this.lastPointer.y = event.clientY;

    this.targetYaw -= deltaX * 0.003;
    this.targetPitch = clamp(this.targetPitch - deltaY * 0.0025, -0.78, 0.42);
  };

  private onPointerUp = (event: PointerEvent) => {
    this.dragging = false;
    if (this.canvas.hasPointerCapture(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
  };

  private onCanvasClick = () => {
    if (this.hoveredIndex < 0) return;
    this.focusDoor(this.hoveredIndex, true);
  };

  private resize = () => {
    const rect = this.root.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private focusDoor(index: number, animated: boolean) {
    const record = this.doors[index];
    if (!record) return;

    this.activeIndex = index;
    this.updatePanel(record.collection, index);

    const doorWorld = new THREE.Vector3();
    record.group.getWorldPosition(doorWorld);
    doorWorld.y = 2.2;
    this.targetPosition.copy(record.focus);

    const direction = doorWorld.clone().sub(this.targetPosition);
    this.targetYaw = Math.atan2(-direction.x, -direction.z);
    this.targetPitch = clamp(Math.atan2(direction.y - 1.6, Math.hypot(direction.x, direction.z)), -0.28, 0.2);

    if (!animated) {
      this.camera.position.copy(this.targetPosition);
      this.yaw = this.targetYaw;
      this.pitch = this.targetPitch;
    }
  }

  private updatePanel(collection: ShowroomCollection, index: number) {
    this.root.style.setProperty("--showroom-accent", collection.accentColor);

    const number = this.root.querySelector<HTMLElement>("[data-showroom-number]");
    const title = this.root.querySelector<HTMLElement>("[data-showroom-title]");
    const description = this.root.querySelector<HTMLElement>("[data-showroom-description]");
    const codes = this.root.querySelector<HTMLElement>("[data-showroom-codes]");
    const link = this.root.querySelector<HTMLAnchorElement>("[data-showroom-link]");
    const count = this.root.querySelector<HTMLElement>("[data-showroom-active-count]");

    if (number) number.textContent = `KOLEKSIYON ${collection.number}`;
    if (title) title.textContent = collection.title;
    if (description) description.textContent = collection.description;
    if (codes) {
      codes.replaceChildren(
        ...collection.modelCodes.map((code) => {
          const item = document.createElement("li");
          item.textContent = code;
          return item;
        })
      );
    }
    if (link) link.href = `/koleksiyonlar/${collection.slug}`;
    if (count) {
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(this.collections.length).padStart(2, "0")}`;
    }

    this.root.querySelectorAll<HTMLElement>("[data-showroom-target]").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });
  }

  private updateMovement(delta: number) {
    const speed = 4.2 * delta;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();

    if (this.keys.has("KeyW") || this.keys.has("ArrowUp") || this.mobileMove.has("forward")) move.add(forward);
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown") || this.mobileMove.has("backward")) move.sub(forward);
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft") || this.mobileMove.has("left")) move.sub(right);
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight") || this.mobileMove.has("right")) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed);
      this.targetPosition.add(move);
      this.targetPosition.x = clamp(this.targetPosition.x, -8.8, 8.8);
      this.targetPosition.z = clamp(this.targetPosition.z, -4.4, 8.2);
    }

    this.camera.position.lerp(this.targetPosition, 1 - Math.pow(0.001, delta));
  }

  private updateCamera(delta: number) {
    this.yaw += (this.targetYaw - this.yaw) * (1 - Math.pow(0.0004, delta));
    this.pitch += (this.targetPitch - this.pitch) * (1 - Math.pow(0.0004, delta));

    const rotation = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");
    this.camera.quaternion.setFromEuler(rotation);
  }

  private updateRaycast() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.doors.map((door) => door.hitbox), false);
    const hovered = hits[0]?.object.userData.index ?? -1;
    this.hoveredIndex = hovered;

    if (hovered >= 0 && hovered !== this.activeIndex) {
      this.updatePanel(this.collections[hovered], hovered);
    } else if (hovered < 0 && this.activeIndex >= 0) {
      this.updatePanel(this.collections[this.activeIndex], this.activeIndex);
    }
  }

  private animate = () => {
    const now = performance.now();
    const delta = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.elapsed += delta;

    this.updateMovement(delta);
    this.updateCamera(delta);
    this.updateRaycast();

    this.doors.forEach((door, index) => {
      const isActive = index === this.activeIndex || index === this.hoveredIndex;
      const pulse = Math.sin(this.elapsed * 2.2 + index) * 0.018;
      door.group.position.y = isActive ? 0.05 + pulse : pulse * 0.4;
      door.group.scale.lerp(
        new THREE.Vector3(isActive ? 1.045 : 1, isActive ? 1.045 : 1, isActive ? 1.045 : 1),
        0.08
      );
    });

    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };
}

export function setupThreeShowroom() {
  document.querySelectorAll<HTMLElement>("[data-three-showroom]").forEach((root) => {
    if (root.dataset.threeShowroomReady === "true") return;

    const canvas = root.querySelector<HTMLCanvasElement>("[data-three-showroom-canvas]");
    const collections = parseShowroomData(root);
    if (!canvas || collections.length === 0) return;

    root.dataset.threeShowroomReady = "true";
    const controller = new ShowroomController(root, canvas, collections);
    controller.init();

    if (window.location.hash === `#${root.id}`) {
      root.classList.add("is-visible");
      root.style.setProperty("--showroom-content-visibility", "visible");
      root.style.setProperty("--showroom-content-opacity", "1");
    }
  });
}
