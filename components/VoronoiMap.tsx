'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';

interface Point {
  longitude: number;
  latitude: number;
  name?: string;
}

interface VoronoiMapProps {
  width?: number;
  height?: number;
  data: Point[];
  winnipegGeoJson: FeatureCollection;
}

const VoronoiMap: React.FC<VoronoiMapProps> = ({
  width = 1028,
  height = 720,
  data,
  winnipegGeoJson
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Adjust projection with larger scale
    const projection = d3.geoMercator()
      .center([-97.15, 49.85])
      .scale(90000) // Increased scale
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw Winnipeg map
    const mapLayer = svg.append("g")
      .selectAll("path")
      .data(winnipegGeoJson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#999")
      .attr("stroke-width", 0.5);

    // Project points
    const projectedPoints = data.map(d => ({
      ...d,
      x: projection([d.longitude, d.latitude])![0],
      y: projection([d.longitude, d.latitude])![1]
    }));

    // Create voronoi generator
    const delaunay = d3.Delaunay.from(
      projectedPoints,
      d => d.x,
      d => d.y
    );

    const bounds = path.bounds(winnipegGeoJson.features[0]);
    const voronoi = delaunay.voronoi([
      bounds[0][0] - 1, // Add padding to bounds
      bounds[0][1] - 1,
      bounds[1][0] + 1,
      bounds[1][1] + 1
    ]);

    // Draw voronoi cells with increased opacity
    const voronoiLayer = svg.append("g")
      .attr("class", "voronoi")
      .selectAll("path")
      .data(projectedPoints)
      .enter()
      .append("path")
      .attr("d", (_, i) => voronoi.renderCell(i))
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 1.5) // Increased stroke width
      .attr("fill", "#2563eb")
      .attr("fill-opacity", 0.1) // Added fill opacity
      .attr("stroke-opacity", 0.8); // Increased stroke opacity

    // Draw fire stations on top
    const stationLayer = svg.append("g")
      .selectAll("circle")
      .data(projectedPoints)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 4)
      .attr("fill", "#dc2626")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .append("title")
      .text(d => d.name || `Fire Station at ${d.longitude}, ${d.latitude}`);

  }, [width, height, data, winnipegGeoJson]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default VoronoiMap;