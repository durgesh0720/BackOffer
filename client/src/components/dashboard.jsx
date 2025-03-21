import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './BarChart';

function Dashboard() {
  const [data, setData] = useState([]);
  const [endYear, setEndYear] = useState('');
  const [sector, setSector] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    fetchData();
  }, [endYear, sector, topic]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/data/', {
        params: { end_year: endYear, sector, topic }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBarClick = (entry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Visualization Dashboard</h1>
      <div className="mb-4 flex space-x-4">
        <div>
          <label className="mr-2">End Year:</label>
          <input
            type="text"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="mr-2">Sector:</label>
          <input
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="mr-2">Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>
      <BarChart data={data} onBarClick={handleBarClick} />
      {selectedEntry && (
        <div className="border p-4 mt-4">
          <h2 className="text-lg font-bold">{selectedEntry.title}</h2>
          <p><strong>Sector:</strong> {selectedEntry.sector || 'N/A'}</p>
          <p><strong>Topic:</strong> {selectedEntry.topic || 'N/A'}</p>
          <p><strong>Intensity:</strong> {selectedEntry.intensity}</p>
          <p><strong>Country:</strong> {selectedEntry.country || 'N/A'}</p>
          <p><strong>End Year:</strong> {selectedEntry.end_year || 'N/A'}</p>
          <p><strong>Source:</strong> <a href={selectedEntry.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{selectedEntry.source}</a></p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;