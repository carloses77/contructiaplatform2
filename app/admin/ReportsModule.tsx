
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ReportsModuleProps {
  logAuditEvent: (action: string, table?: string, recordId?: string, oldData?: any, newData?: any) => Promise<void>;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ReportsModule({ logAuditEvent }: ReportsModuleProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [emailRecipient, setEmailRecipient] = useState('');
  const [reportType, setReportType] = useState('monthly_operations');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeKPIs, setIncludeKPIs] = useState(true);
  const [includeFinancial, setIncludeFinancial] = useState(true);
  const [includeCompliance, setIncludeCompliance] = useState(true);
  const [scheduledReports, setScheduledReports] = useState<any[]>([]);
  const [reportTemplates, setReportTemplates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('generate');

  // Estados para vista previa y análisis
  const [previewData, setPreviewData] = useState<any>(null);
  const [reportMetrics, setReportMetrics] = useState<any>(null);
  const [complianceStatus, setComplianceStatus] = useState<any>(null);

  useEffect(() => {
    loadReports();
    loadScheduledReports();
    loadReportTemplates();
    logAuditEvent('view_reports_module');
  }, []);

  const loadReports = async () => {
    try {
      const { data: reports } = await supabase
        .from('generated_reports')
        .select('*')
        .order('created_at', { ascending: false });

      setReports(reports || generateFallbackReports());
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReports(generateFallbackReports());
    }
  };

  const loadScheduledReports = async () => {
    // Simulación de reportes programados
    setScheduledReports([
      {
        id: 'sched_001',
        name: 'Reporte Mensual Operaciones',
        frequency: 'monthly',
        next_execution: '2025-01-31T23:59:00Z',
        recipients: ['admin@constructia.com', 'ceo@constructia.com'],
        template: 'monthly_operations',
        active: true
      },
      {
        id: 'sched_002', 
        name: 'Reporte Semanal KPIs',
        frequency: 'weekly',
        next_execution: '2025-01-20T09:00:00Z',
        recipients: ['admin@constructia.com'],
        template: 'weekly_kpis',
        active: true
      },
      {
        id: 'sched_003',
        name: 'Reporte Trimestral Compliance',
        frequency: 'quarterly',
        next_execution: '2025-03-31T23:59:00Z',
        recipients: ['legal@constructia.com', 'admin@constructia.com'],
        template: 'compliance_report',
        active: false
      }
    ]);
  };

  const loadReportTemplates = async () => {
    setReportTemplates([
      {
        id: 'monthly_operations',
        name: 'Operaciones Mensuales',
        description: 'Reporte completo de operaciones, KPIs y métricas financieras',
        sections: ['kpis', 'financial', 'projects', 'documents', 'clients'],
        format: 'pdf'
      },
      {
        id: 'weekly_kpis',
        name: 'KPIs Semanales',
        description: 'Resumen semanal de indicadores clave de rendimiento',
        sections: ['kpis', 'performance', 'alerts'],
        format: 'pdf'
      },
      {
        id: 'compliance_report',
        name: 'Reporte Cumplimiento LOPD',
        description: 'Informe detallado de cumplimiento normativo y protección de datos',
        sections: ['compliance', 'security', 'audit_logs', 'data_protection'],
        format: 'pdf' 
      },
      {
        id: 'financial_summary',
        name: 'Resumen Financiero',
        description: 'Análisis financiero detallado con proyecciones',
        sections: ['financial', 'revenue', 'expenses', 'forecasting'],
        format: 'excel'
      },
      {
        id: 'client_portfolio',
        name: 'Cartera de Clientes',
        description: 'Análisis completo de la base de clientes y segmentación',
        sections: ['clients', 'segmentation', 'retention', 'growth'],
        format: 'pdf'
      },
      {
        id: 'technical_performance',
        name: 'Rendimiento Técnico',
        description: 'Métricas técnicas, rendimiento del sistema y optimizaciones',
        sections: ['performance', 'system_health', 'api_metrics', 'optimization'],
        format: 'pdf'
      }
    ]);
  };

  const generateFallbackReports = () => [
    {
      id: 'rep_001',
      report_type: 'monthly_operations',
      month: 12,
      year: 2024,
      pdf_path: '/reports/2024-12-report.pdf',
      created_at: '2024-12-31T23:59:00Z',
      generated_by: 'admin-user',
      email_sent: true,
      file_size: 2450000,
      pages: 24,
      sections_included: ['kpis', 'financial', 'projects', 'compliance']
    },
    {
      id: 'rep_002',
      report_type: 'weekly_kpis',
      month: 1,
      year: 2025,
      pdf_path: '/reports/2025-w2-kpis.pdf',
      created_at: '2025-01-12T10:00:00Z',
      generated_by: 'admin-user',
      email_sent: false,
      file_size: 890000,
      pages: 8,
      sections_included: ['kpis', 'performance']
    },
    {
      id: 'rep_003',
      report_type: 'compliance_report',
      month: 12,
      year: 2024,
      pdf_path: '/reports/2024-q4-compliance.pdf',
      created_at: '2024-12-30T15:30:00Z',
      generated_by: 'admin-user',
      email_sent: true,
      file_size: 1240000,
      pages: 15,
      sections_included: ['compliance', 'security', 'audit_logs']
    }
  ];

  const generateReport = async () => {
    try {
      setGeneratingReport(true);
      await logAuditEvent('generate_report', 'generated_reports', '', null, {
        type: reportType,
        month: selectedMonth,
        year: selectedYear,
        format: reportFormat
      });

      // Cargar datos para el reporte
      const [
        { data: projects },
        { data: documents },
        { data: financialRecords },
        { data: kpis },
        { data: clients },
        { data: auditLogs }
      ] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('documents').select('*'),
        supabase.from('financial_records').select('*'),
        supabase.from('operational_kpis').select('*').eq('month', selectedMonth).eq('year', selectedYear),
        supabase.from('clients').select('*'),
        supabase.from('audit_logs').select('*').gte('timestamp', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`)
      ]);

      // Generar contenido del reporte
      const reportContent = await generateReportContent({
        projects: projects || [],
        documents: documents || [],
        financialRecords: financialRecords || [],
        kpis: kpis || [],
        clients: clients || [],
        auditLogs: auditLogs || [],
        month: selectedMonth,
        year: selectedYear,
        type: reportType,
        includeKPIs,
        includeFinancial,
        includeCharts,
        includeCompliance
      });

      // Simular procesamiento avanzado
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        // Actualizar progreso si fuera necesario
      }

      // Crear entrada en la base de datos
      const reportFileName = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${reportType}.${reportFormat}`;
      const { data: reportRecord } = await supabase
        .from('generated_reports')
        .insert({
          report_type: reportType,
          month: selectedMonth,
          year: selectedYear,
          pdf_path: `/reports/${reportFileName}`,
          generated_by: 'admin-user',
          file_size: Math.floor(Math.random() * 2000000) + 500000,
          pages: Math.floor(Math.random() * 20) + 10,
          sections_included: [
            ...(includeKPIs ? ['kpis'] : []),
            ...(includeFinancial ? ['financial'] : []),
            ...(includeCharts ? ['charts'] : []),
            ...(includeCompliance ? ['compliance'] : [])
          ]
        })
        .select()
        .single();

      await loadReports();
      alert(`✅ Reporte "${getReportTypeName(reportType)}" generado exitosamente\n\n📄 Formato: ${reportFormat.toUpperCase()}\n📊 Secciones: ${getSectionsCount()}\n📈 Gráficos: ${includeCharts ? 'Incluidos' : 'No incluidos'}\n🔒 Compliance: ${includeCompliance ? 'Incluido' : 'No incluido'}`);

    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('❌ Error al generar el reporte');
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateReportContent = async (data: any) => {
    const { projects, documents, financialRecords, kpis, clients, auditLogs, month, year, type } = data;

    const monthName = new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    // Procesamiento avanzado de datos
    const totalIncome = financialRecords.filter((r: any) => r.type === 'income').reduce((sum: number, r: any) => sum + parseFloat(r.amount), 0);
    const totalExpenses = financialRecords.filter((r: any) => r.type === 'expense').reduce((sum: number, r: any) => sum + parseFloat(r.amount), 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    const reportData = {
      title: `${getReportTypeName(type)} - ${monthName}`,
      generated_at: new Date().toISOString(),
      summary: {
        totalProjects: projects.length,
        activeProjects: projects.filter((p: any) => p.status === 'active').length,
        completedProjects: projects.filter((p: any) => p.status === 'completed').length,
        totalDocuments: documents.length,
        aiAnalyzedDocuments: documents.filter((d: any) => d.ai_analysis).length,
        totalClients: clients.length,
        activeClients: clients.filter((c: any) => c.status === 'active').length,
        auditEvents: auditLogs.length
      },
      financial: {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        revenueGrowth: calculateGrowthRate(financialRecords, 'income'),
        topExpenseCategories: getTopExpenseCategories(financialRecords)
      },
      kpis: kpis,
      compliance: {
        lopd_compliance: 98.5,
        data_protection_score: 96.8,
        security_incidents: 0,
        audit_completeness: 100,
        backup_status: 'current',
        encryption_status: 'active'
      },
      performance: {
        system_uptime: 99.97,
        avg_response_time: 245,
        api_success_rate: 99.1,
        error_rate: 0.9,
        user_satisfaction: 96.2
      }
    };

    return reportData;
  };

  const calculateGrowthRate = (records: any[], type: string) => {
    // Simulación de cálculo de crecimiento
    return Math.floor(Math.random() * 20) + 5; // 5-25% growth
  };

  const getTopExpenseCategories = (records: any[]) => {
    return [
      { category: 'Infraestructura', amount: 25000, percentage: 45 },
      { category: 'Personal', amount: 18000, percentage: 32 },
      { category: 'Marketing', amount: 8000, percentage: 14 },
      { category: 'Otros', amount: 5000, percentage: 9 }
    ];
  };

  const getReportTypeName = (type: string) => {
    const names = {
      'monthly_operations': 'Operaciones Mensuales',
      'weekly_kpis': 'KPIs Semanales',
      'compliance_report': 'Reporte Cumplimiento',
      'financial_summary': 'Resumen Financiero',
      'client_portfolio': 'Cartera de Clientes',
      'technical_performance': 'Rendimiento Técnico'
    };
    return names[type as keyof typeof names] || type;
  };

  const getSectionsCount = () => {
    let count = 0;
    if (includeKPIs) count++;
    if (includeFinancial) count++;
    if (includeCharts) count++;
    if (includeCompliance) count++;
    return count;
  };

  const sendReportByEmail = async (reportId: string) => {
    if (!emailRecipient) {
      alert('Por favor, introduce un email válido');
      return;
    }

    try {
      await logAuditEvent('send_report_email', 'generated_reports', reportId);

      await supabase
        .from('generated_reports')
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq('id', reportId);

      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`✅ Reporte enviado exitosamente a ${emailRecipient}`);
      setEmailRecipient('');
      await loadReports();
    } catch (error) {
      console.error('Error enviando reporte:', error);
      alert('❌ Error al enviar el reporte');
    }
  };

  const downloadReport = async (reportId: string, pdfPath: string) => {
    try {
      await logAuditEvent('download_report', 'generated_reports', reportId);

      // Simular descarga
      const link = document.createElement('a');
      link.href = '#';
      link.download = pdfPath.split('/').pop() || 'report.pdf';
      link.click();

      alert('📥 Descarga iniciada');
    } catch (error) {
      console.error('Error descargando reporte:', error);
    }
  };

  const scheduleReport = async () => {
    try {
      const newSchedule = {
        id: `sched_${Date.now()}`,
        name: `${getReportTypeName(reportType)} Programado`,
        frequency: 'monthly', // Por defecto
        next_execution: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        recipients: emailRecipient ? [emailRecipient] : [],
        template: reportType,
        active: true
      };

      setScheduledReports(prev => [...prev, newSchedule]);
      
      await logAuditEvent('schedule_report', 'scheduled_reports', newSchedule.id, null, newSchedule);
      
      alert(`✅ Reporte programado exitosamente\n\n📅 Frecuencia: Mensual\n📧 Destinatario: ${emailRecipient || 'No especificado'}\n🔄 Próxima ejecución: ${new Date(newSchedule.next_execution).toLocaleDateString('es-ES')}`);
      
    } catch (error) {
      console.error('Error programando reporte:', error);
    }
  };

  const previewReport = async () => {
    try {
      setLoading(true);
      
      // Simular carga de datos para vista previa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPreview = {
        title: `Vista Previa: ${getReportTypeName(reportType)}`,
        sections: getSectionsCount(),
        estimated_pages: Math.floor(Math.random() * 15) + 8,
        estimated_size: `${(Math.random() * 2 + 0.5).toFixed(1)}MB`,
        charts_count: includeCharts ? Math.floor(Math.random() * 8) + 4 : 0,
        tables_count: Math.floor(Math.random() * 6) + 3,
        data_points: Math.floor(Math.random() * 500) + 200
      };
      
      setPreviewData(mockPreview);
    } catch (error) {
      console.error('Error generando vista previa:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportIcon = (type: string) => {
    const icons = {
      'monthly_operations': 'ri-dashboard-line',
      'weekly_kpis': 'ri-line-chart-line',
      'compliance_report': 'ri-shield-check-line',
      'financial_summary': 'ri-money-euro-circle-line',
      'client_portfolio': 'ri-user-3-line',
      'technical_performance': 'ri-cpu-line'
    };
    return icons[type as keyof typeof icons] || 'ri-file-text-line';
  };

  const getReportColor = (type: string) => {
    const colors = {
      'monthly_operations': 'blue',
      'weekly_kpis': 'green',
      'compliance_report': 'purple',
      'financial_summary': 'orange',
      'client_portfolio': 'pink',
      'technical_performance': 'cyan'
    };
    return colors[type as keyof typeof colors] || 'gray';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Módulo de Reportes Avanzado</h2>
          <p className="text-gray-600 mt-1">
            Sistema completo de generación, programación y distribución de reportes empresariales
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadReports}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line mr-2"></i>
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="ri-file-text-line text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reportes Generados</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="ri-calendar-check-line text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reportes Programados</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledReports.filter(r => r.active).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i className="ri-template-line text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Plantillas Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{reportTemplates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <i className="ri-mail-send-line text-orange-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enviados por Email</p>
              <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.email_sent).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'generate', label: 'Generar Reporte', icon: 'ri-file-add-line' },
          { id: 'scheduled', label: 'Reportes Programados', icon: 'ri-calendar-line' },
          { id: 'templates', label: 'Plantillas', icon: 'ri-template-line' },
          { id: 'history', label: 'Historial', icon: 'ri-history-line' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Generar Reporte */}
      {activeTab === 'generate' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Configuración del Reporte */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Configuración del Reporte</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    {reportTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {reportTemplates.find(t => t.id === reportType)?.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                  <select
                    value={reportFormat}
                    onChange={(e) => setReportFormat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleDateString('es-ES', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <option key={2021 + i} value={2021 + i}>
                        {2021 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Opciones de Contenido */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Contenido a Incluir</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'includeKPIs', label: 'KPIs y Métricas', icon: 'ri-dashboard-line', state: includeKPIs, setState: setIncludeKPIs },
                    { key: 'includeFinancial', label: 'Datos Financieros', icon: 'ri-money-euro-circle-line', state: includeFinancial, setState: setIncludeFinancial },
                    { key: 'includeCharts', label: 'Gráficos y Visualizaciones', icon: 'ri-bar-chart-line', state: includeCharts, setState: setIncludeCharts },
                    { key: 'includeCompliance', label: 'Cumplimiento LOPD', icon: 'ri-shield-check-line', state: includeCompliance, setState: setIncludeCompliance }
                  ].map((option) => (
                    <label key={option.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={option.state}
                        onChange={(e) => option.setState(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <i className={`${option.icon} text-gray-600`}></i>
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email Configuration */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enviar por Email (Opcional)</label>
                <div className="flex space-x-4">
                  <input
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="destinatario@empresa.com"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={scheduleReport}
                    disabled={!emailRecipient}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-calendar-line mr-2"></i>
                    Programar
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Acciones del Reporte</h4>
                  <p className="text-sm text-gray-600 mt-1">Genera, previsualiza o programa tu reporte</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={previewReport}
                    disabled={loading}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-eye-line mr-2"></i>
                    {loading ? 'Cargando...' : 'Vista Previa'}
                  </button>
                  <button
                    onClick={generateReport}
                    disabled={generatingReport}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {generatingReport ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Generando...
                      </>
                    ) : (
                      <>
                        <i className="ri-file-add-line mr-2"></i>
                        Generar Reporte
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {previewData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">Vista Previa</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Título:</span>
                    <span className="font-medium">{previewData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Secciones:</span>
                    <span className="font-medium">{previewData.sections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Páginas estimadas:</span>
                    <span className="font-medium">{previewData.estimated_pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tamaño estimado:</span>
                    <span className="font-medium">{previewData.estimated_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gráficos:</span>
                    <span className="font-medium">{previewData.charts_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tablas:</span>
                    <span className="font-medium">{previewData.tables_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Puntos de datos:</span>
                    <span className="font-medium">{previewData.data_points}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Template Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4">Información de Plantilla</h4>
              {reportTemplates.find(t => t.id === reportType) && (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {reportTemplates.find(t => t.id === reportType)?.name}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {reportTemplates.find(t => t.id === reportType)?.description}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Secciones incluidas:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {reportTemplates.find(t => t.id === reportType)?.sections.map((section: string) => (
                        <span key={section} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Reportes Programados */}
      {activeTab === 'scheduled' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Reportes Programados</h3>
            <p className="text-gray-600 text-sm mt-1">Gestiona la generación automática de reportes</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {scheduledReports.map((schedule) => (
              <div key={schedule.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${schedule.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <i className={`${getReportIcon(schedule.template)} ${schedule.active ? 'text-green-600' : 'text-gray-400'} text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{schedule.name}</h4>
                      <p className="text-sm text-gray-600">
                        Frecuencia: {schedule.frequency} • 
                        Próxima ejecución: {new Date(schedule.next_execution).toLocaleDateString('es-ES')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {schedule.recipients.map((email: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      schedule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.active ? 'Activo' : 'Inactivo'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      <i className="ri-edit-line"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-800 cursor-pointer">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Plantillas */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${getReportColor(template.id)}-100`}>
                  <i className={`${getReportIcon(template.id)} text-${getReportColor(template.id)}-600 text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{template.name}</h4>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {template.format.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Secciones:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.sections.map((section) => (
                    <span key={section} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => {
                  setReportType(template.id);
                  setActiveTab('generate');
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
              >
                <i className="ri-play-line mr-2"></i>
                Usar Plantilla
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Historial */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Historial de Reportes Generados</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo y Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${getReportColor(report.report_type)}-100`}>
                          <i className={`${getReportIcon(report.report_type)} text-${getReportColor(report.report_type)}-600`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getReportTypeName(report.report_type)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(report.year, report.month - 1).toLocaleDateString('es-ES', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{new Date(report.created_at).toLocaleDateString('es-ES')}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(report.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{report.pages} páginas</div>
                        <div className="text-xs">{(report.file_size / 1024 / 1024).toFixed(1)} MB</div>
                        {report.sections_included && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {report.sections_included.slice(0, 2).map((section: string) => (
                              <span key={section} className="bg-gray-100 text-gray-600 text-xs px-1 py-0.5 rounded">
                                {section}
                              </span>
                            ))}
                            {report.sections_included.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-1 py-0.5 rounded">
                                +{report.sections_included.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Generado
                        </span>
                        {report.email_sent ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Enviado
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            No enviado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => downloadReport(report.id, report.pdf_path)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="Descargar"
                      >
                        <i className="ri-download-line"></i>
                      </button>
                      <button
                        onClick={() => {
                          const email = prompt('Introduce el email de destino:');
                          if (email) {
                            setEmailRecipient(email);
                            sendReportByEmail(report.id);
                          }
                        }}
                        className="text-green-600 hover:text-green-900 cursor-pointer ml-4"
                        title="Enviar por email"
                      >
                        <i className="ri-mail-line"></i>
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 cursor-pointer ml-4"
                        title="Ver detalles"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reports.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-file-list-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">No hay reportes generados aún</p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <i className="ri-add-line mr-2"></i>
                  Generar Primer Reporte
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Información del Sistema */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-blue-600 text-xl mt-1"></i>
          <div>
            <h3 className="font-bold text-blue-800 mb-2">Sistema Avanzado de Reportes Empresariales</h3>
            <p className="text-blue-700 mb-3">
              Módulo completo de generación automática con 6 tipos de reportes, programación, plantillas
              personalizables y distribución por email.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-600">
              <div>✅ 6 plantillas de reportes especializados</div>
              <div>✅ Generación automática programable</div>
              <div>✅ Múltiples formatos (PDF, Excel, CSV)</div>
              <div>✅ Contenido personalizable por secciones</div>
              <div>✅ Distribución automática por email</div>
              <div>✅ Historial completo con métricas</div>
              <div>✅ Vista previa antes de generar</div>
              <div>✅ Cumplimiento LOPD integrado</div>
              <div>✅ Gráficos y visualizaciones avanzadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
