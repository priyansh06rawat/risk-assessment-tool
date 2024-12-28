"use client"; 
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Alert, AlertTitle } from '../components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';

// Define interfaces for our data types
interface ApplicantData {
  creditScore: string;
  income: string;
  employmentYears: string;
  debtToIncome: string;
  assetValue: string;
  paymentHistory: string;
}

interface PerformanceData {
  month: string;
  defaultRate: number;
  approvalRate: number;
  avgRiskScore: number;
}

const RiskAssessmentDashboard = () => {
  // Initialize state with proper types
  const [applicantData, setApplicantData] = useState<ApplicantData>({
    creditScore: '',
    income: '',
    employmentYears: '',
    debtToIncome: '',
    assetValue: '',
    paymentHistory: '',
  });

  const [riskScore, setRiskScore] = useState<number | null>(null);

  // Sample historical performance data
  const performanceData: PerformanceData[] = [
    { month: 'Jan', defaultRate: 2.1, approvalRate: 65, avgRiskScore: 720 },
    { month: 'Feb', defaultRate: 1.8, approvalRate: 68, avgRiskScore: 715 },
    { month: 'Mar', defaultRate: 2.3, approvalRate: 62, avgRiskScore: 705 },
    { month: 'Apr', defaultRate: 1.9, approvalRate: 70, avgRiskScore: 725 },
    { month: 'May', defaultRate: 2.0, approvalRate: 67, avgRiskScore: 718 },
    { month: 'Jun', defaultRate: 1.7, approvalRate: 72, avgRiskScore: 730 }
  ];

  const calculateRiskScore = () => {
    // This is a simplified risk calculation model
    const baseScore = 500;
    const creditWeight = parseFloat(applicantData.creditScore) * 0.4;
    const incomeWeight = parseFloat(applicantData.income) * 0.00015;
    const employmentWeight = parseFloat(applicantData.employmentYears) * 10;
    const dtiWeight = parseFloat(applicantData.debtToIncome) * -5;
    const assetWeight = parseFloat(applicantData.assetValue) * 0.0001;
    const historyWeight = parseFloat(applicantData.paymentHistory) * 20;

    const score = Math.min(850, Math.max(300, 
      baseScore + creditWeight + incomeWeight + employmentWeight + dtiWeight + assetWeight + historyWeight
    ));
    
    setRiskScore(Math.round(score));
  };

  const getRiskLevel = (score: number | null) => {
    if (!score) return { level: 'Not Calculated', color: 'bg-gray-100 text-gray-800' };
    if (score >= 750) return { level: 'Low Risk', color: 'bg-green-100 text-green-800' };
    if (score >= 650) return { level: 'Moderate Risk', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'High Risk', color: 'bg-red-100 text-red-800' };
  };

  const handleInputChange = (field: keyof ApplicantData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplicantData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Risk Assessment Dashboard</h1>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={calculateRiskScore}
          >
            Calculate Risk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(applicantData).map(([field, value]) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, ' $1').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={value}
                    onChange={handleInputChange(field as keyof ApplicantData)}
                    placeholder={`Enter ${field.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Score Display */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            {riskScore !== null ? (
              <div className="space-y-4">
                <div className={`p-4 rounded ${getRiskLevel(riskScore).color}`}>
                  <div className="text-2xl font-bold">Risk Score: {riskScore}</div>
                  <div className="text-lg">{getRiskLevel(riskScore).level}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Approval Probability</div>
                    <div className="text-xl font-semibold">
                      {Math.min(100, Math.max(0, Math.round((riskScore - 300) / 5.5)))}%
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Suggested Interest Rate</div>
                    <div className="text-xl font-semibold">
                      {(10 - (riskScore - 300) / 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Enter applicant information and calculate risk score</AlertTitle>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historical Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="defaultRate" stroke="#ef4444" name="Default Rate %" />
                <Line yAxisId="right" type="monotone" dataKey="approvalRate" stroke="#3b82f6" name="Approval Rate %" />
                <Line yAxisId="right" type="monotone" dataKey="avgRiskScore" stroke="#10b981" name="Avg Risk Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approval Rate</p>
                <p className="text-2xl font-semibold">67.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Default Rate</p>
                <p className="text-2xl font-semibold">2.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Loan Size</p>
                <p className="text-2xl font-semibold">$245K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Risk Score Avg</p>
                <p className="text-2xl font-semibold">715</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentDashboard;