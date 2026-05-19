/**
 * @file Custom interfaces for parking lots and users
 */

interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

interface Schedule {
  daytimePrice: number;
  daytimeRate: number;
  daytimeStartTime: string;
  daytimeEndTime: string;
  daytimeMaxPrice: number;
  eveningPrice: number;
  eveningRate: number;
  eveningStartTime: string;
  eveningEndTime: string;
  eveningMaxPrice: number;
  weekendPrice: number;
  weekendRate: number;
  weekendStartTime: string;
  weekendEndTime: string;
  weekendMaxPrice: number;
  rateUnit: string;
}

export interface ParkingLot {
  lotId: number;
  name: string;
  floor: number;
  type: "staff" | "student";
  capacity: number;
  schedule: Schedule;
  latitude: number;
  longitude: number;
  address: Address;
  validPermits: Array<string>;
  description?: string;
  availability: string | null;
  openSpots: number;
}

export interface Stall {
  stallId: number;
  lotId: number;
  location: string;
  parkingType: "regular" | "electric" | "small" | "handicap";
  occupied: boolean;
}
