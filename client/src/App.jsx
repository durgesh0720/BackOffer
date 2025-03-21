import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import TopicCloud from './components/TopicCloud';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    end_year: '', topic: '', sector: '', region: '', pestle: '', source: '',
    swot: '', country: '', city: '', start_year: '', impact: ''
  });
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://backoffer.onrender.com/data/', { params: filters });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicClick = (topic) => {
    setFilters((prev) => ({ ...prev, topic }));
  };

  const handleResetFilters = () => {
    setFilters({
      end_year: '', topic: '', sector: '', region: '', pestle: '', source: '',
      swot: '', country: '', city: '', start_year: '', impact: ''
    });
    setSelectedEntry(null);
  };

  // Skeleton Component for Filters
  const FilterSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {Array(11).fill().map((_, index) => (
        <div key={index}>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  // Skeleton Component for Visualization Cards
  const VisualizationSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 animate-fade-in">
        Data Insights Dashboard
      </h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Filters</h2>
        {isLoading ? (
          <FilterSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { label: 'End Year', name: 'end_year', placeholder: 'e.g., 2018' },
              { label: 'Topic', name: 'topic', placeholder: 'e.g., oil' },
              { label: 'Sector', name: 'sector', placeholder: 'e.g., Energy' },
              { label: 'Region', name: 'region', placeholder: 'e.g., Northern America' },
              { label: 'PESTLE', name: 'pestle', placeholder: 'e.g., Economic' },
              { label: 'Source', name: 'source', placeholder: 'e.g., EIA' },
              { label: 'SWOT', name: 'swot', placeholder: 'e.g., Strength' },
              { label: 'Country', name: 'country', placeholder: 'e.g., United States' },
              { label: 'City', name: 'city', placeholder: 'e.g., New York' },
              { label: 'Start Year', name: 'start_year', placeholder: 'e.g., 2017' },
              { label: 'Impact', name: 'impact', placeholder: 'e.g., 3' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-600">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleFilterChange}
                  className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleResetFilters}
          className="mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
          disabled={isLoading}
        >
          Reset Filters
        </button>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          <>
            {Array(6).fill().map((_, index) => (
              <VisualizationSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Intensity by Country</h2>
              <BarChart data={data} onBarClick={setSelectedEntry} metric="intensity" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Likelihood Over Time</h2>
              <LineChart data={data} metric="likelihood" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Relevance by Region</h2>
              <BarChart data={data} onBarClick={setSelectedEntry} metric="relevance" xField="region" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Topic Distribution</h2>
              <PieChart data={data} field="topic" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Topic Word Cloud</h2>
              <TopicCloud data={data} onTopicClick={handleTopicClick} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Selected Entry Details</h2>
              {selectedEntry ? (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-800">{selectedEntry.title}</h3>
                  <p><strong>Intensity:</strong> {selectedEntry.intensity}</p>
                  <p><strong>Likelihood:</strong> {selectedEntry.likelihood}</p>
                  <p><strong>Relevance:</strong> {selectedEntry.relevance}</p>
                  <p><strong>End Year:</strong> {selectedEntry.end_year || 'N/A'}</p>
                  <p><strong>Country:</strong> {selectedEntry.country || 'N/A'}</p>
                  <p><strong>Region:</strong> {selectedEntry.region || 'N/A'}</p>
                  <p><strong>City:</strong> {selectedEntry.city || 'N/A'}</p>
                  <p><strong>Topic:</strong> {selectedEntry.topic || 'N/A'}</p>
                  <p><strong>Sector:</strong> {selectedEntry.sector || 'N/A'}</p>
                  <p><strong>PESTLE:</strong> {selectedEntry.pestle || 'N/A'}</p>
                  <p><strong>Source:</strong> <a href={selectedEntry.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedEntry.source}</a></p>
                </div>
              ) : (
                <p className="text-gray-500">Click a bar to view details</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;