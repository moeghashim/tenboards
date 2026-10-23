import { useEffect, useState } from "react";

import { type GeoPermissibleObjects, geoMercator, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";

import type { GeoCoordinate, Shipment } from "./shipment-data";

type WorldTopology = {
  objects: {
    countries: unknown;
    land: unknown;
  };
  type: "Topology";
};

type RoutePoint = {
  coordinates: GeoCoordinate;
  country: string;
  label: string;
};

type ProjectedRoutePoint = RoutePoint & {
  point: [number, number] | null;
};

const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const WIDTH = 1000;
const HEIGHT = 520;
const SNAPSHOT_PADDING = 72;
const ROUTE_CONTEXT_SCALE = 1.85;
const MIN_LONGITUDE_SPAN = 10;
const MIN_LATITUDE_SPAN = 8;

function roundCoordinate(value: number) {
  return Number(value.toFixed(3));
}

function createRouteLine(shipment: Shipment): GeoJSON.LineString {
  return {
    type: "LineString",
    coordinates: [shipment.origin.coordinates, shipment.destination.coordinates],
  };
}

function createSnapshotFrame(shipment: Shipment): GeoJSON.LineString {
  const [originLongitude, originLatitude] = shipment.origin.coordinates;
  const [destinationLongitude, destinationLatitude] = shipment.destination.coordinates;
  const centerLongitude = (originLongitude + destinationLongitude) / 2;
  const centerLatitude = (originLatitude + destinationLatitude) / 2;
  const longitudeSpan = Math.max(
    Math.abs(destinationLongitude - originLongitude) * ROUTE_CONTEXT_SCALE,
    MIN_LONGITUDE_SPAN,
  );
  const latitudeSpan = Math.max(
    Math.abs(destinationLatitude - originLatitude) * ROUTE_CONTEXT_SCALE,
    MIN_LATITUDE_SPAN,
  );
  const west = centerLongitude - longitudeSpan / 2;
  const east = centerLongitude + longitudeSpan / 2;
  const south = centerLatitude - latitudeSpan / 2;
  const north = centerLatitude + latitudeSpan / 2;

  return {
    type: "LineString",
    coordinates: [
      [west, south],
      [east, south],
      [east, north],
      [west, north],
      [west, south],
    ],
  };
}

function buildMapGeometry(shipment: Shipment | null) {
  const routeLine = shipment ? createRouteLine(shipment) : null;
  const projection = geoMercator();

  if (shipment) {
    projection.fitExtent(
      [
        [SNAPSHOT_PADDING, SNAPSHOT_PADDING],
        [WIDTH - SNAPSHOT_PADDING, HEIGHT - SNAPSHOT_PADDING],
      ],
      createSnapshotFrame(shipment) as GeoPermissibleObjects,
    );
  } else {
    projection
      .center([102, 17])
      .scale(760)
      .translate([WIDTH / 2, HEIGHT / 2]);
  }

  const pathGenerator = geoPath(projection);

  function projectPoint(routePoint: RoutePoint): ProjectedRoutePoint {
    const point = projection(routePoint.coordinates);

    return {
      ...routePoint,
      point: point ? [roundCoordinate(point[0]), roundCoordinate(point[1])] : null,
    };
  }

  return {
    path: pathGenerator,
    routePath: routeLine ? pathGenerator(routeLine as GeoPermissibleObjects) : null,
    routePoints: shipment
      ? [
          projectPoint({
            coordinates: shipment.origin.coordinates,
            country: shipment.origin.country,
            label: "Origin",
          }),
          projectPoint({
            coordinates: shipment.destination.coordinates,
            country: shipment.destination.country,
            label: "Destination",
          }),
        ]
      : [],
  };
}

type ShipmentRouteMapProps = {
  shipment: Shipment | null;
};

export function ShipmentRouteMap({ shipment }: ShipmentRouteMapProps) {
  const [borders, setBorders] = useState<GeoJSON.MultiLineString | null>(null);
  const [land, setLand] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      try {
        const response = await fetch(WORLD_ATLAS_URL);

        if (!response.ok) {
          throw new Error(`Failed to load world atlas: ${response.status}`);
        }

        const topology = (await response.json()) as WorldTopology;
        const landCollection = feature(
          topology as unknown as Parameters<typeof feature>[0],
          topology.objects.land as unknown as Parameters<typeof feature>[1],
        ) as GeoJSON.FeatureCollection;
        const countryBorders = mesh(
          topology as unknown as Parameters<typeof mesh>[0],
          topology.objects.countries as unknown as Parameters<typeof mesh>[1],
          (a, b) => a !== b,
        ) as GeoJSON.MultiLineString;

        if (!cancelled) {
          setBorders(countryBorders);
          setLand(landCollection);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  const { path, routePath, routePoints } = buildMapGeometry(shipment);

  return (
    <div className="bg-muted relative size-full min-h-0 overflow-hidden">
      <svg
        aria-label={
          shipment ? `Route from ${shipment.origin.display} to ${shipment.destination.display}` : "Shipment region map"
        }
        className="bg-muted block size-full"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect height={HEIGHT} width={WIDTH} className="fill-muted" />
        {land && (
          <path
            d={path(land as GeoPermissibleObjects) ?? undefined}
            className="fill-card"
            stroke="var(--border)"
            strokeWidth={0.8}
          />
        )}
        {borders && (
          <path d={path(borders as GeoPermissibleObjects) ?? undefined} className="stroke-border fill-none" />
        )}
        {routePath && (
          <path
            d={routePath}
            className="stroke-primary fill-none"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeWidth={3}
          />
        )}
        {routePoints.map(({ country, label, point }) =>
          point ? (
            <g key={label} transform={`translate(${point[0]}, ${point[1]})`}>
              {label === "Origin" ? (
                <circle className="fill-background stroke-primary" r={8} strokeWidth={3} />
              ) : (
                <rect className="fill-background stroke-primary" x={-8} y={-8} width={16} height={16} strokeWidth={3} />
              )}
              <circle className="fill-primary" r={3} />
              <text className="fill-foreground text-base font-medium" dy={-14} textAnchor="middle">
                {label}: {country}
              </text>
            </g>
          ) : null,
        )}
      </svg>
      {shipment && (
        <div className="bg-card/95 text-foreground absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-2 border-t px-4 py-2 text-xs">
          <span>Origin: {shipment.origin.display}</span>
          <span>Destination: {shipment.destination.display}</span>
        </div>
      )}
    </div>
  );
}
