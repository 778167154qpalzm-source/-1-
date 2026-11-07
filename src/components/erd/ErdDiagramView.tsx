import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHEMAS, TABLE_GROUPS } from '../../db/schema';
import { RELATIONSHIPS } from '../../db/relationships';
import { getErdPositions, saveErdPositions, getTableData } from '../../db/storage';
import { TableSchema, Relationship, TableGroupId } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Search, 
  Filter, 
  Download, 
  Key, 
  Link2, 
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
  Move
} from 'lucide-react';

export const ErdDiagramView: React.FC = () => {
  const { t, language, setSelectedTable, setCurrentView, showNotification } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [zoom, setZoom] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 30 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging single table card
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Active hover/selection
  const [highlightedTable, setHighlightedTable] = useState<string | null>(null);
  const [highlightedRel, setHighlightedRel] = useState<Relationship | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<TableGroupId | 'all'>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [hiddenTables, setHiddenTables] = useState<Set<string>>(new Set());

  // Load positions on mount
  useEffect(() => {
    setPositions(getErdPositions());
  }, []);

  // Filtered tables
  const visibleSchemas = useMemo(() => {
    return SCHEMAS.filter(schema => {
      if (hiddenTables.has(schema.name)) return false;
      if (selectedGroup !== 'all' && schema.groupId !== selectedGroup) return false;
      if (filterSearch) {
        const query = filterSearch.toLowerCase();
        return (
          schema.name.toLowerCase().includes(query) ||
          schema.nameAr.toLowerCase().includes(query) ||
          schema.nameEn.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedGroup, filterSearch, hiddenTables]);

  // Card dimensions for port calculation
  const CARD_WIDTH = 300;
  const HEADER_HEIGHT = 42;
  const ROW_HEIGHT = 26;

  const getTableHeight = (schema: TableSchema) => {
    return HEADER_HEIGHT + schema.columns.length * ROW_HEIGHT + 14;
  };

  // Auto-arrange layout
  const handleAutoLayout = () => {
    const newPositions: Record<string, { x: number; y: number }> = {};
    const cols = 4;
    const gapX = 360;
    const gapY = 480;

    SCHEMAS.forEach((schema, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      newPositions[schema.name] = {
        x: 60 + col * gapX,
        y: 60 + row * gapY
      };
    });

    setPositions(newPositions);
    saveErdPositions(newPositions);
    showNotification(language === 'ar' ? 'تمت إعادة ترتيب الجداول تلقائياً' : 'Auto layout applied', 'info');
  };

  // Reset viewport
  const handleResetView = () => {
    setZoom(0.85);
    setPan({ x: 30, y: 30 });
  };

  // Mouse pan handlers for canvas background
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else if (draggingTable) {
      const newX = Math.round((e.clientX - pan.x) / zoom - dragOffset.x);
      const newY = Math.round((e.clientY - pan.y) / zoom - dragOffset.y);
      setPositions(prev => ({
        ...prev,
        [draggingTable]: { x: Math.max(10, newX), y: Math.max(10, newY) }
      }));
    }
  };

  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (draggingTable) {
      saveErdPositions(positions);
      setDraggingTable(null);
    }
  };

  // Start dragging a table card
  const handleStartDragTable = (e: React.MouseEvent, tableName: string) => {
    e.stopPropagation();
    const pos = positions[tableName] || { x: 50, y: 50 };
    setDraggingTable(tableName);
    setDragOffset({
      x: (e.clientX - pan.x) / zoom - pos.x,
      y: (e.clientY - pan.y) / zoom - pos.y
    });
  };

  // Compute bezier curve paths for all relationships between visible tables
  const connections = useMemo(() => {
    const visibleNames = new Set(visibleSchemas.map(s => s.name));
    return RELATIONSHIPS.filter(rel => visibleNames.has(rel.sourceTable) && visibleNames.has(rel.targetTable)).map(rel => {
      const sourcePos = positions[rel.sourceTable] || { x: 0, y: 0 };
      const targetPos = positions[rel.targetTable] || { x: 0, y: 0 };
      const sourceSchema = SCHEMAS.find(s => s.name === rel.sourceTable);
      const targetSchema = SCHEMAS.find(s => s.name === rel.targetTable);

      const sourceColIndex = sourceSchema?.columns.findIndex(c => c.name === rel.sourceColumn) ?? 0;
      const targetColIndex = targetSchema?.columns.findIndex(c => c.name === rel.targetColumn) ?? 0;

      const sourceY = sourcePos.y + HEADER_HEIGHT + sourceColIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
      const targetY = targetPos.y + HEADER_HEIGHT + targetColIndex * ROW_HEIGHT + ROW_HEIGHT / 2;

      // Handle self-referencing relationships (e.g. ChartOfAccounts.ParentAccountId -> ChartOfAccounts.AccountId)
      if (rel.isSelfReferential || rel.sourceTable === rel.targetTable) {
        const xStart = sourcePos.x + CARD_WIDTH;
        const xEnd = targetPos.x + CARD_WIDTH;
        const loopWidth = 70;
        const path = `M ${xStart} ${sourceY} C ${xStart + loopWidth} ${sourceY - 30}, ${xEnd + loopWidth} ${targetY + 30}, ${xEnd} ${targetY}`;
        return {
          rel,
          path,
          midX: xStart + loopWidth,
          midY: (sourceY + targetY) / 2
        };
      }

      // Determine left/right side connection based on relative positions
      let x1 = sourcePos.x + CARD_WIDTH;
      let x2 = targetPos.x;

      if (sourcePos.x > targetPos.x + CARD_WIDTH) {
        x1 = sourcePos.x;
        x2 = targetPos.x + CARD_WIDTH;
      } else if (sourcePos.x < targetPos.x && sourcePos.x + CARD_WIDTH > targetPos.x) {
        // Vertical or overlapping
        x1 = sourcePos.x + CARD_WIDTH / 2;
        x2 = targetPos.x + CARD_WIDTH / 2;
      }

      const dx = Math.abs(x2 - x1) * 0.5;
      const path = `M ${x1} ${sourceY} C ${x1 + (x2 > x1 ? dx : -dx)} ${sourceY}, ${x2 + (x2 > x1 ? -dx : dx)} ${targetY}, ${x2} ${targetY}`;

      return {
        rel,
        path,
        midX: (x1 + x2) / 2,
        midY: (sourceY + targetY) / 2
      };
    });
  }, [visibleSchemas, positions]);

  // Export diagram as SVG file
  const handleExportSvg = () => {
    const svgEl = document.getElementById('erd-svg-canvas');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounting-database-erd-${new Date().toISOString().slice(0, 10)}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(language === 'ar' ? 'تم تنزيل مخطط ERD بصيغة SVG بنجاح' : 'ERD SVG exported successfully', 'success');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#070B14] overflow-hidden select-none relative">
      {/* Top Toolbar */}
      <div className="h-14 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-5 flex items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-2">
          {/* Group Filter */}
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value as any)}
            className="bg-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">{language === 'ar' ? 'كافة المجموعات (18 جدولاً)' : 'All Groups (18 tables)'}</option>
            {TABLE_GROUPS.map(g => (
              <option key={g.id} value={g.id}>
                {language === 'ar' ? g.nameAr : g.nameEn}
              </option>
            ))}
          </select>

          {/* Quick Table Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              placeholder={language === 'ar' ? 'بحث عن جدول...' : 'Filter table...'}
              className="bg-slate-800 text-xs text-white placeholder-slate-400 rounded-xl ps-8 pe-3 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500 w-36 sm:w-48"
            />
          </div>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            <button
              onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              title={t('zoomOut')}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-300 font-semibold min-w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              title={t('zoomIn')}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-all hover:text-white"
            title={t('fitScreen')}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleAutoLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:text-white"
            title={t('rearrange')}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('rearrange')}</span>
          </button>

          <button
            onClick={handleExportSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'تصدير SVG' : 'Export SVG'}</span>
          </button>
        </div>
      </div>

      {/* ERD Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-erd-grid relative"
      >
        {/* Transformable Canvas Group */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4000px',
            height: '4000px'
          }}
        >
          {/* SVG Connectors Layer */}
          <svg
            id="erd-svg-canvas"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="line-grad-default" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="line-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="1" />
              </linearGradient>
              <marker id="marker-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#3B82F6" />
              </marker>
            </defs>

            {connections.map(({ rel, path, midX, midY }) => {
              const isSelected = highlightedRel?.id === rel.id;
              const isRelatedTable = highlightedTable === rel.sourceTable || highlightedTable === rel.targetTable;
              const strokeColor = isSelected ? '#F59E0B' : isRelatedTable ? '#38BDF8' : '#334155';
              const strokeWidth = isSelected ? 3.5 : isRelatedTable ? 2.5 : 1.5;
              const opacity = (highlightedTable || highlightedRel) ? (isSelected || isRelatedTable ? 1 : 0.15) : 0.75;

              return (
                <g key={rel.id} className="transition-opacity duration-200">
                  {/* Thick invisible path for easy hover/clicking */}
                  <path
                    d={path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={16}
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => setHighlightedRel(rel)}
                    onMouseLeave={() => setHighlightedRel(null)}
                    onClick={() => setHighlightedRel(rel)}
                  />
                  {/* Visual Bezier line */}
                  <path
                    d={path}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    strokeDasharray={rel.isSelfReferential ? '4 3' : undefined}
                  />
                  {/* Cardinality badge pill */}
                  <g
                    transform={`translate(${midX - 16}, ${midY - 10})`}
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => setHighlightedRel(rel)}
                  >
                    <rect
                      width="32"
                      height="18"
                      rx="9"
                      fill="#0B1120"
                      stroke={isSelected ? '#F59E0B' : '#334155'}
                      strokeWidth="1.2"
                    />
                    <text
                      x="16"
                      y="12"
                      textAnchor="middle"
                      fill={isSelected ? '#F59E0B' : '#94A3B8'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono"
                    >
                      {rel.cardinality}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* HTML Table Cards Layer */}
          <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 2 }}>
            {visibleSchemas.map(schema => {
              const pos = positions[schema.name] || { x: 50, y: 50 };
              const group = TABLE_GROUPS.find(g => g.id === schema.groupId);
              const isCardHighlighted = highlightedTable === schema.name;
              const isRelTargetOrSource = highlightedRel?.sourceTable === schema.name || highlightedRel?.targetTable === schema.name;
              const isDimmed = (highlightedTable && !isCardHighlighted) || (highlightedRel && !isRelTargetOrSource);

              return (
                <div
                  key={schema.name}
                  id={`table-card-${schema.name}`}
                  dir="ltr"
                  onMouseDown={(e) => handleStartDragTable(e, schema.name)}
                  onMouseEnter={() => setHighlightedTable(schema.name)}
                  onMouseLeave={() => setHighlightedTable(null)}
                  className={`absolute rounded-2xl bg-[#0F172A] border transition-shadow duration-150 select-none shadow-2xl ${
                    isCardHighlighted || isRelTargetOrSource
                      ? 'border-blue-400 ring-2 ring-blue-500/40 shadow-blue-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${CARD_WIDTH}px`,
                    opacity: isDimmed ? 0.35 : 1
                  }}
                >
                  {/* Header */}
                  <div
                    onDoubleClick={() => {
                      setSelectedTable(schema.name);
                      setCurrentView('table-details');
                    }}
                    className={`px-3.5 py-2.5 rounded-t-2xl bg-gradient-to-r ${group?.headerColor || 'from-slate-800 to-slate-900'} flex items-center justify-between cursor-move`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-white truncate">
                          {schema.name}
                        </span>
                        <span className="text-[10px] text-white/80 font-normal truncate">
                          ({language === 'ar' ? schema.nameAr : schema.nameEn})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTable(schema.name);
                        setCurrentView('table-details');
                      }}
                      className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                      title={language === 'ar' ? 'عرض تفاصيل وسجلات الجدول' : 'Open table details'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Columns List */}
                  <div className="p-2 space-y-0.5">
                    {schema.columns.map(col => {
                      return (
                        <div
                          key={col.name}
                          className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 text-xs transition-colors"
                          title={`${col.descriptionAr}\n${col.foreignRef ? `-> FK: ${col.foreignRef.table}.${col.foreignRef.column}` : ''}`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {col.isPrimary ? (
                              <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : col.isForeign ? (
                              <Link2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-600 text-[10px] shrink-0">
                                #
                              </span>
                            )}

                            <span
                              className={`font-mono text-[11px] truncate ${
                                col.isPrimary
                                  ? 'font-bold text-amber-300'
                                  : col.isForeign
                                  ? 'font-semibold text-sky-300'
                                  : 'text-slate-300'
                              }`}
                            >
                              {col.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {col.isUnique && !col.isPrimary && (
                              <span className="text-[9px] font-mono px-1 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                                UQ
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-slate-500">
                              {col.type}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Stats */}
                  <div className="px-3 py-1.5 bg-slate-950/60 rounded-b-2xl border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{schema.columns.length} {t('fieldsCount')}</span>
                    <span>{getTableData(schema.name).length} {t('recordsCount')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Relationship Info Overlay */}
      {highlightedRel && (
        <div className="absolute bottom-4 start-4 z-20 max-w-md bg-slate-900/95 border border-blue-500/50 backdrop-blur rounded-2xl p-4 shadow-2xl text-xs space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-400 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              {language === 'ar' ? 'تفاصيل العلاقة المحددة' : 'Relationship Details'}
            </span>
            <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {highlightedRel.cardinality} ({highlightedRel.type})
            </span>
          </div>
          <div className="font-mono text-slate-200">
            <span className="text-amber-400 font-bold">{highlightedRel.sourceTable}.{highlightedRel.sourceColumn}</span>
            <span className="text-slate-500 px-2">⟶</span>
            <span className="text-emerald-400 font-bold">{highlightedRel.targetTable}.{highlightedRel.targetColumn}</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {language === 'ar' ? highlightedRel.labelAr : highlightedRel.labelEn}
          </p>
        </div>
      )}
    </div>
  );
};
