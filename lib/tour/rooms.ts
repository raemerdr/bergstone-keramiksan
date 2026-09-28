/* Bergstone Keramiksan 360° showroom: room graph taken over from the original tour project.
   Photos: Insta360 Pro originals → public/assets/tour/rooms/{room}-{2k|4k|6k}.jpg (tools/build-tour.py).
   view  = arrival view [pan, tilt, fov]   (pan + = left, fov diagonal)
   links = [pan, target room, arrival view in target, distance to the next position in m] */

export type RoomId =
  | 'node1' | 'node2' | 'node4' | 'node5' | 'node6' | 'node7' | 'node8' | 'node9'
  | 'node10' | 'node11' | 'node12' | 'node13' | 'node14' | 'node15' | 'node16' | 'node17';

export type ViewTuple = [pan: number, tilt: number, fov: number];
export type RoomLink = [pan: number, target: RoomId, arrival: ViewTuple, distance: number];
export interface View { pan: number; tilt: number; fov: number }

export const ROOMS: Record<RoomId, { view: ViewTuple; links: RoomLink[] }> = {
  node1: { view: [44.08, -3.72, 100], links: [[159.6, 'node2', [121.9, 1.1, 100], 4.4], [39.61, 'node6', [42.9, 2.2, 100], 4.26]] },
  node2: { view: [121.9, 1.1, 100], links: [[-64.48, 'node1', [44.6, -0.6, 100], 4.4], [120.69, 'node5', [-128.1, 7.3, 100], 4.36]] },
  node5: { view: [-128.1, 7.3, 100], links: [[-189.21, 'node2', [-59.3, 0.5, 100], 4.36]] },
  node6: { view: [42.9, 2.2, 100], links: [[200.32, 'node1', [154.8, -0.5, 100], 4.26], [129.93, 'node7', [176.5, -0.1, 100], 4.28], [47.06, 'node8', [-115.4, 1.6, 100], 4.35]] },
  node7: { view: [176.5, -0.1, 100], links: [[90.87, 'node6', [40.2, 1.7, 100], 4.28]] },
  node8: { view: [-115.4, 1.6, 100], links: [[-276.89, 'node6', [-168.2, 0.9, 100], 4.35], [243.73, 'node4', [61.6, -2.4, 100], 4.25]] },
  node4: { view: [61.6, -2.4, 100], links: [[-279.4, 'node8', [62.5, 0.6, 100], 4.25], [-210, 'node9', [-78, 0.1, 100], 4.14]] },
  node9: { view: [-78, 0.1, 100], links: [[98.74, 'node4', [-13.6, -1.6, 100], 4.14], [-78.31, 'node10', [-31.5, 2.1, 100], 4.3]] },
  node10: { view: [-31.5, 2.1, 100], links: [[148.28, 'node9', [101.7, 0, 100], 4.3], [-29.14, 'node11', [-125.6, 2.4, 100], 4.32]] },
  node11: { view: [-125.6, 2.4, 100], links: [[2.43, 'node10', [150.9, 0, 100], 4.32], [-47.99, 'node12', [-119.1, -1.1, 100], 4.23]] },
  node12: { view: [-119.1, -1.1, 100], links: [[60.8, 'node11', [136.7, 1.1, 100], 4.23], [241.93, 'node13', [-76.6, -3.9, 100], 4.35]] },
  node13: { view: [-76.6, -3.9, 100], links: [[108.18, 'node12', [63.2, 0.1, 100], 4.35], [281.41, 'node14', [-173.9, -4.9, 100], 4.29]] },
  node14: { view: [-173.9, -4.9, 100], links: [[77.97, 'node13', [101.4, 0, 100], 4.29], [178.76, 'node15', [-101.9, -2.6, 100], 4.32]] },
  node15: { view: [-101.9, -2.6, 100], links: [[91.82, 'node14', [77.7, -0.3, 100], 4.32], [-99.83, 'node16', [156.9, -2.9, 100], 4.18]] },
  node16: { view: [156.9, -2.9, 100], links: [[-21.22, 'node15', [80.2, 0, 100], 4.18], [-204.25, 'node17', [-98.9, -9.2, 100], 4.26]] },
  node17: { view: [-98.9, -9.2, 100], links: [[95.26, 'node16', [-24.3, 0, 100], 4.26], [-179.13, 'node11', [38.7, -2, 100], 17.72]] },
};

export const ROOM_ORDER: RoomId[] = ['node1', 'node2', 'node5', 'node6', 'node7', 'node8', 'node4', 'node9', 'node10', 'node11', 'node12', 'node13', 'node14', 'node15', 'node16', 'node17'];

/** Where the tour opens: the entrance, at its arrival view. */
export const START_VIEW: View & { room: RoomId } = { room: 'node1', pan: 44.08, tilt: -3.72, fov: 100 };

export const roomPhoto = (id: RoomId, size: '2k' | '4k' | '6k') => `/assets/tour/rooms/${id}-${size}.jpg`;
export const roomThumb = (id: RoomId) => `/assets/tour/thumbs/${id}.jpg`;
