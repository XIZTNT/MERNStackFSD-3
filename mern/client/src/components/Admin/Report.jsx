import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Container, Row, Col, Card } from "react-bootstrap";

// Register all chart elements and tooltip plugin
ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function Report() {
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/report-data")
      .then(res => res.json())
      .then(data => {
        // Bar chart data
        setBarData(data.data.agent_bar_data);

        // Line chart data: remove duplicate dates
        const rawLineData = data.data.transaction_line_data;
        const lineChartDataClean = [];
        const seenDates = new Set();
        rawLineData.forEach(t => {
          if (!seenDates.has(t.date)) {
            lineChartDataClean.push(t);
            seenDates.add(t.date);
          }
        });

        setLineData(lineChartDataClean);
      })
      .catch(err => console.error(err));
  }, []);

  // Bar chart setup
  const barChartData = {
    labels: barData.map(a => a.agent),
    datasets: [
      {
        label: "Total Transactions",
        data: barData.map(a => a.total),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `$${context.raw}`; // Shows exact value on hover
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Line chart setup
  const lineChartData = {
    labels: lineData.map(t => t.date),
    datasets: [
      {
        label: "Daily Transactions",
        data: lineData.map(t => t.total),
        borderColor: "rgba(153,102,255,1)",
        backgroundColor: "rgba(153,102,255,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Show loading while data fetches
  if (!barData.length || !lineData.length) {
    return <div className="text-center mt-5">Loading charts...</div>;
  }

  return (
    <Container className="mt-5">
      <Row className="g-4">
        {/* Bar Chart */}
        <Col md={6}>
          <Card className="shadow h-100">
            <Card.Body>
              <Card.Title className="text-center">Agent Transactions</Card.Title>
              <div style={{ height: "350px" }}>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Line Chart */}
        <Col md={6}>
          <Card className="shadow h-100">
            <Card.Body>
              <Card.Title className="text-center">Last 14 Days Transactions</Card.Title>
              <div style={{ height: "350px" }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}