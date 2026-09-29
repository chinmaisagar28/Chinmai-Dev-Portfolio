/**
 * CHARACTER POSE SYSTEM — data-driven poses.
 * The SVG character is never redrawn; every pose is just a set of joint
 * transforms the controller interpolates between. Adding a new action =
 * adding one pose object (spec §45–46).
 *
 * Rotation conventions (SVG y-down, positive rotate() = clockwise on screen):
 *  - armLux / armRux: upper-arm rotation at the shoulder. 0 = hanging down.
 *    Negative on the RIGHT arm raises the hand toward screen-right/up.
 *    Positive on the LEFT arm raises the hand toward screen-left/up.
 *  - armLelbow / armRelbow: forearm rotation at the elbow.
 *  - legLhip / legRhip: thigh rotation at the hip. legLknee / legRknee at knees.
 *  - headRot: head tilt at the neck. headX/headY, eyeX/eyeY: look offsets in px.
 *  - torsoRot: lean. rootRot: whole-figure tilt. jump: px lift off the ground.
 *  - shadow: ground-shadow scale multiplier (shrinks mid-jump).
 */

export interface Pose {
  rootRot: number;
  torsoRot: number;
  headRot: number;
  headX: number;
  headY: number;
  eyeX: number;
  eyeY: number;
  armLux: number;
  armLelbow: number;
  armRux: number;
  armRelbow: number;
  legLhip: number;
  legLknee: number;
  legRhip: number;
  legRknee: number;
  jump: number;
  shadow: number;
}

const base: Pose = {
  rootRot: 0,
  torsoRot: 0,
  headRot: 0,
  headX: 0,
  headY: 0,
  eyeX: 0,
  eyeY: 0,
  armLux: -3,
  armLelbow: -4,
  armRux: 3,
  armRelbow: 4,
  legLhip: 0,
  legLknee: 0,
  legRhip: 0,
  legRknee: 0,
  jump: 0,
  shadow: 1,
};

function pose(mod: Partial<Pose>): Pose {
  return { ...base, ...mod };
}

export const poses: Record<string, Pose> = {
  /* standing naturally, soft weight */
  idle: pose({}),

  /* hero entrance: open, grounded, slight shift */
  hero: pose({ torsoRot: 1.2, armLux: -5, armRux: 5, armRelbow: 7, headRot: -1 }),

  /* waving hello / goodbye (wiggle added by controller) */
  wave: pose({ armRux: -148, armRelbow: -22, headRot: 3, eyeX: 1 }),

  /* pointing toward screen-right content */
  pointRight: pose({
    armRux: -96,
    armRelbow: -10,
    armLux: -4,
    armLelbow: -6,
    headRot: 2.5,
    eyeX: 2,
    torsoRot: -1.5,
  }),

  /* pointing toward screen-left content */
  pointLeft: pose({
    armLux: 96,
    armLelbow: 10,
    armRux: 4,
    armRelbow: 6,
    headRot: -2.5,
    eyeX: -2,
    torsoRot: 1.5,
  }),

  /* raising toward something above (form fields, upload) */
  pointUp: pose({ armRux: -158, armRelbow: -14, headRot: 1.5, eyeY: -2, headY: -1 }),

  /* hand to chin, observing */
  think: pose({
    armRux: -38,
    armRelbow: -122,
    armLux: -2,
    headRot: -5,
    eyeX: -1,
    eyeY: 1.5,
    headY: 0.5,
    torsoRot: 1,
  }),

  /* inspecting the Zoho diagram — lean in, eyes right */
  inspect: pose({
    armRux: -30,
    armRelbow: -110,
    armLux: -3,
    headRot: 4,
    eyeX: 2.5,
    eyeY: 1,
    torsoRot: -1,
  }),

  /* guiding toward the contact form */
  guide: pose({
    armRux: -78,
    armRelbow: -38,
    armLux: -4,
    armLelbow: -6,
    headRot: 2,
    eyeX: 1.5,
    torsoRot: -1,
  }),

  /* success — both arms up, tiny hop */
  happy: pose({
    armLux: 152,
    armLelbow: 12,
    armRux: -152,
    armRelbow: -12,
    headRot: 0,
    eyeY: -1.5,
    jump: 9,
    shadow: 0.82,
  }),

  /* quick click acknowledgement */
  click: pose({
    armRux: -70,
    armRelbow: -25,
    torsoRot: -2,
    headRot: 2,
    eyeX: 2,
  }),

  /* looking at a project */
  look: pose({ headRot: 2, eyeX: 2, armRux: 4, armRelbow: 6, torsoRot: -0.8 }),
};

/** Joint names the controller can address */
export type JointName =
  | "root" | "bob" | "torso" | "head" | "eyes"
  | "armLux" | "armLelbow" | "armRux" | "armRelbow"
  | "legLhip" | "legLknee" | "legRhip" | "legRknee"
  | "shadow";

export const ZERO_POSE = base;
