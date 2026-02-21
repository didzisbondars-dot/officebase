"use client";

import { useEffect, useRef } from "react";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export function MapboxMap({ latitude, longitude, zoom = 11 }: MapboxMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapRef.current || !token) return;
    let map: any;
    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = token;
      map = new mapboxgl.default.Map({
        container: mapRef.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [longitude, latitude],
        zoom,
      });
      new mapboxgl.default.Marker({ color: "#0f1f3d" })
        .setLngLat([longitude, latitude])
        .addTo(map);
      map.addControl(new mapboxgl.default.NavigationControl(), "top-right");
      map.scrollZoom.disable();
    });
    return () => map?.remove();
  }, [latitude, longitude, zoom, token]);

  return <div ref={mapRef} className="w-full h-full" />;
}
