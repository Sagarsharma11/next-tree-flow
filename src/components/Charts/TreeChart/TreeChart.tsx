"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import styles from "./chart.module.css";

const TreeChart = ({ data }: any) => {

    const chartRef = useRef<SVGSVGElement | null>(null);

    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!data) return;

        const width = 2400; // Large width for scrollability
        const dx = 150; // More vertical gap
        const dy = 350; // More horizontal gap

        const root = d3.hierarchy(data);
        const tree = d3.tree().nodeSize([dx, dy]);

        root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
        tree(root);

        let x0 = Infinity;
        let x1 = -x0;
        root.each((d:any) => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        const height = x1 - x0 + dx * 2;

        const svg = d3
            //@ts-ignore
            .select(chartRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-dy, x0 - dx - 50, width + 1000, height])
            .attr("style", "font: 16px sans-serif;");

        // Links
        svg
            .append("g")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", 1.5)
            .selectAll()
            .data(root.links())
            .join("path")
            .attr(
                "d",
                //@ts-ignore
                d3
                    .linkHorizontal()
                    .x((d: any) => d.y)
                    .y((d: any) => d.x)
            );

        // Nodes
        const node = svg
            .append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 2)
            .selectAll()
            .data(root.descendants())
            .join("g")
            .attr("transform", (d) => `translate(${d.y},${d.x})`);

        // Circles
        node
            .append("circle")
            //   .attr("fill", (d) => (d.children ? "#555" : "#999"))
            .attr("fill", "red")
            .attr("r", 5);

        // Labels
        node
            .append("text")
            .attr("dy", "0.35em")
            .attr("x", (d) => (d.children ? -15 : 15))
            .attr("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name)
            .attr("fill", "#fff")
            .style("font-size", "18px");

        // Background rectangle for text
        const rect =
            node
                .insert("rect", "text")
                .attr("x", function (d) {
                    //@ts-ignore
                    return d.children ? - this.nextSibling.getBBox().width - 30 : -5;
                })
                .attr("y", -30)
                .attr("width", function () {
                    //@ts-ignore
                    return this.nextSibling.getBBox().width + 60;
                })
                .attr("height", 56)
                .attr("fill", "#2874a6")
                .attr("rx", 6)
                .attr("ry", 6)
                .lower();

        // Tooltip Events on Rectangles
        rect
            .on("mouseover", (event, d) => {
                // console.log("hello")
                if (tooltipRef.current) {
                    tooltipRef.current.style.display = "block";
                    tooltipRef.current.innerHTML = d.data.name;
                }
            })
            .on("mousemove", (event) => {
                if (tooltipRef.current) {
                    tooltipRef.current.style.left = event.pageX + 10 + "px";
                    tooltipRef.current.style.top = event.pageY + 10 + "px";
                }
            })
            .on("mouseout", () => {
                if (tooltipRef.current) {
                    tooltipRef.current.style.display = "none";
                }
            });

    }, [data]);

    return (
        <div className={styles.chartContainer}>
            <div className={styles.scrollContainer}>
                <svg
                    //@ts-ignore
                    ref={chartRef}></svg>
            </div>
            <div ref={tooltipRef} className={styles.tooltip}></div>
        </div>
    );
};

export default TreeChart;