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
  width = 975,
  height = 610,
  data,
  winnipegGeoJson
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create projection centered on Winnipeg
    const projection = d3.geoMercator()
      .fitSize([width, height], winnipegGeoJson);

    // Create path generator
    const path = d3.geoPath().projection(projection);

    // Draw Winnipeg map
    svg.append("g")
      .selectAll("path")
      .data(winnipegGeoJson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#999")
      .attr("stroke-width", 0.5);

    // Create voronoi generator
    const delaunay = d3.Delaunay.from(
      data,
      d => projection([d.longitude, d.latitude])![0],
      d => projection([d.longitude, d.latitude])![1]
    );
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    // Draw voronoi cells
    svg.append("g")
      .attr("class", "voronoi")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (_, i) => voronoi.renderCell(i))
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("opacity", 0.5);

    // Draw fire stations
    svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("transform", d => {
        const [x, y] = projection([d.longitude, d.latitude])!;
        return `translate(${x}, ${y})`;
      })
      .attr("r", 4)
      .attr("fill", "#dc2626")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
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