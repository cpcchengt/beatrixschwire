/* eslint-disable */
"use client"
import React, { useRef, useEffect, useState } from 'react';

// 定义轨迹点的类型
interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
}

// interface ChaoticPendulumProps {}

function ChaoticPendulum() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [initialTheta, setInitialTheta] = useState<number>(Math.PI / 2);
  const [initialPhi, setInitialPhi] = useState<number>(Math.PI / 2);
  const [length, setLength] = useState<number>(200);
  const [radius, setRadius] = useState<number>(60);

  // 物理参数
  const g: number = 9.81;
  const m1: number = 20;
  const m2: number = 10;
  const dt: number = 0.05;

  let theta: number = initialTheta;
  let phi: number = initialPhi;
  let omega1: number = 0;
  let omega2: number = 0;

  const trail: TrailPoint[] = [];
  const maxTrailLength: number = 100;

  // 星空背景的星星
  const stars: { x: number; y: number; radius: number; opacity: number }[] = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 自适应屏幕尺寸
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      // const maxWidth = window.innerWidth * 0.9; // 限制最大宽度为屏幕宽度的90%
      // const maxHeight = window.innerHeight * 0.6; // 限制最大高度为屏幕高度的60%
      // const width = Math.min(maxWidth, 800); // 设置最大宽度限制
      // const height = Math.min(maxHeight, 600); // 设置最大高度限制

      const width = window.innerWidth;
      const height = window.innerHeight;

      // 设置 CSS 尺寸
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // 设置绘制分辨率
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // 缩放上下文以匹配设备像素比
      ctx.scale(dpr, dpr);
    };

    // 初始调整尺寸
    resizeCanvas();

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);

    // 计算缩放比例（基于基准尺寸）
    const baseSize = 600; // 基准尺寸（原始 Canvas 尺寸）
    const scale = Math.min(canvas.width / baseSize, canvas.height / baseSize);

    // 动态调整长条长度和圆环半径
    const scaledLength = length * scale;
    const scaledRadius = radius * scale;
    // const L1: number = scaledLength / 4;
    // const L2: number = (3 * scaledLength) / 4;
    const L2: number = scaledLength / 4;
    const L1: number = (3 * scaledLength) / 4;

    const originX: number = canvas.width / (2 * window.devicePixelRatio);
    const originY: number = canvas.height / (2 * window.devicePixelRatio);

    // 初始化星星
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width / window.devicePixelRatio,
        y: Math.random() * canvas.height / window.devicePixelRatio,
        radius: Math.random() * 2,
        opacity: Math.random(),
      });
    }

    const simulate = (): void => {
      if (isPaused) return;

      const num1: number = -g * (m1 * L1 / 2 + m2 * L2) * Math.sin(theta) - m2 * g * scaledRadius * Math.sin(phi);
      const den1: number = (m1 * (L1 * L1 + L2 * L2) / 3 + m2 * L2 * L2);
      const alpha1: number = num1 / den1;

      const num2: number = -g * Math.sin(phi) - L2 * alpha1 * Math.cos(theta - phi);
      const den2: number = scaledRadius;
      const alpha2: number = num2 / den2;

      omega1 += alpha1 * dt;
      omega2 += alpha2 * dt;
      theta += omega1 * dt;
      phi += omega2 * dt;
    };

    const drawBackground = (): void => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // 渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#1a1a40');
      gradient.addColorStop(1, '#4b0082');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 绘制星星并添加闪烁效果
      stars.forEach((star) => {
        star.opacity += (Math.random() - 0.5) * 0.05;
        star.opacity = Math.max(0, Math.min(1, star.opacity));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBackground();

      const x1: number = originX + L1 * Math.sin(theta);
      const y1: number = originY + L1 * Math.cos(theta);
      const x2: number = originX - L2 * Math.sin(theta);
      const y2: number = originY - L2 * Math.cos(theta);

      const xRing: number = x2 + scaledRadius * Math.sin(phi);
      const yRing: number = y2 + scaledRadius * Math.cos(phi);

      trail.push({ x: xRing, y: yRing, opacity: 1 });
      if (trail.length > maxTrailLength) trail.shift();

      trail.forEach((point, index) => {
        point.opacity = index / maxTrailLength;
      });

      ctx.beginPath();
      const trailGradient = ctx.createLinearGradient(xRing, yRing, trail[0]?.x || xRing, trail[0]?.y || yRing);
      trailGradient.addColorStop(0, 'rgba(255, 165, 0, 1)');
      trailGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
      ctx.strokeStyle = trailGradient;
      ctx.lineWidth = 2;
      for (let i = 0; i < trail.length - 1; i++) {
        ctx.globalAlpha = trail[i].opacity;
        ctx.moveTo(trail[i].x, trail[i].y);
        ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      const barGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      barGradient.addColorStop(0, '#00CED1');
      barGradient.addColorStop(1, '#20B2AA');
      ctx.strokeStyle = barGradient;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(originX, originY, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.beginPath();
      const ringGradient = ctx.createRadialGradient(xRing, yRing, 0, xRing, yRing, scaledRadius);
      ringGradient.addColorStop(0, '#FFD700');
      ringGradient.addColorStop(1, '#FFA500');
      ctx.strokeStyle = ringGradient;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
      ctx.arc(xRing, yRing, scaledRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const animate = (): void => {
      simulate();
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animate as unknown as number);
    };
  }, [isPaused, initialTheta, initialPhi, length, radius]);

  const handleReset = (): void => {
    theta = initialTheta;
    phi = initialPhi;
    omega1 = 0;
    omega2 = 0;
    trail.length = 0;
  };

  return (
    <div ref={containerRef} style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', margin: '0 auto' }}
      />
    </div>
  );
}

export default ChaoticPendulum;