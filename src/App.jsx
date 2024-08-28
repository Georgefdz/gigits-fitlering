import React, { useState, useEffect } from 'react';
import Airtable from 'airtable';
import placeholderImage from './assets/bookCover.png';




import './App.css';
import Header from './Components/Header';

const App = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filters, setFilters] = useState({
        format: '',
        language: '',
        concept: ''
    });
    const [uniqueFormats, setUniqueFormats] = useState([]);
    const [uniqueLanguages, setUniqueLanguages] = useState([]);
    const [uniqueConcepts, setUniqueConcepts] = useState([]);

    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        // Configure Airtable
        const base = new Airtable({ apiKey: API_KEY }).base('appz3L59vDo6XArUw');

        // Fetch records
        base('Content To-Go').select({
            maxRecords: 100,
            view: 'Grid view'
        }).eachPage((records, fetchNextPage) => {
            console.log('Raw Airtable records:', records); // Log raw records for debugging

            // Create an array of objects where each object represents a row with columns as properties
            const formattedRecords = records.map(record => {
                const fields = record.fields || {};
                return {
                    id: record.id,
                    name: fields.Name || '',
                    format: fields.Format && fields.Format.length > 0 ? fields.Format[0] : '', // Get the first format value if available
                    language: fields.Language && fields.Language.length > 0 ? fields.Language[0] : '',
                    concept: fields.Concept && fields.Concept.length > 0 ? fields.Concept[0] : '',
                    recoImg: fields.Reco_Image && fields.Reco_Image.length > 0 ? fields.Reco_Image[0].url : null,
                };
            });

            console.log('Formatted records:', formattedRecords); // Log formatted records for debugging

            setRecords(formattedRecords);
            setFilteredRecords(formattedRecords);

            // Extract and normalize unique format values
            const formatSet = new Set();
            formattedRecords.forEach(record => {
                if (record.format) {
                    const normalizedFormat = record.format.trim().toLowerCase();
                    formatSet.add(normalizedFormat);
                }
            });
            const formats = Array.from(formatSet).sort();
            console.log('Unique formats:', formats); // Log unique formats for debugging
            setUniqueFormats(formats);

            // Extract and normalize unique language values
            const languageSet = new Set();
            formattedRecords.forEach(record => {
                if (record.language) {
                    const normalizedLanguage = record.language.trim().toLowerCase();
                    languageSet.add(normalizedLanguage);
                }
            });
            const languages = Array.from(languageSet).sort();
            console.log('Unique languages:', languages); // Log unique languages for debugging
            setUniqueLanguages(languages);

            // Extract and normalize unique concept values
            const conceptSet = new Set();
            formattedRecords.forEach(record => {
                if (record.concept) {
                    const normalizedConcept = record.concept.trim().toLowerCase();
                    conceptSet.add(normalizedConcept);
                }
            });
            const concepts = Array.from(conceptSet).sort();
            console.log('Unique concepts:', concepts); // Log unique concepts for debugging
            setUniqueConcepts(concepts);

            fetchNextPage();
        }, (err) => {
            if (err) {
                console.error('Error fetching Airtable records:', err);
                return;
            }
        });
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    useEffect(() => {
        const filtered = records.filter(record => {
            return (
                (!filters.format || record.format.trim().toLowerCase() === filters.format) &&
                (!filters.language || record.language.trim().toLowerCase() === filters.language) &&
                (!filters.concept || record.concept.trim().toLowerCase() === filters.concept)
            );
        });
        setFilteredRecords(filtered);
    }, [filters, records]);

    return (
        <>
            <Header />
            <div className='body-container'>
                <h1>gigits recommendations</h1>

                <div>
                    <label>
                        Format:
                        <select name="format" onChange={handleFilterChange} value={filters.format}>
                            <option value="">All</option>
                            {uniqueFormats.map(format => (
                                <option key={format} value={format}>
                                    {format.charAt(0).toUpperCase() + format.slice(1)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Language:
                        <select name="language" onChange={handleFilterChange} value={filters.language}>
                            <option value="">All</option>
                            {uniqueLanguages.map(language => ( 
                                <option key={language} value={language}>
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Concept:
                        <select name="concept" onChange={handleFilterChange} value={filters.concept}>
                            <option value="">All</option>
                            {uniqueConcepts.map(concept => (
                                <option key={concept} value={concept}>
                                    {concept.charAt(0).toUpperCase() + concept.slice(1)}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <ul className='item-container'>
                    {filteredRecords.map(record => (
                        <div key={record.id} className='item'>
                            <li className='list-item'>
                                <img src={record.recoImg || placeholderImage} alt={record.name}/>
                                {record.name}
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </>
        
    );
};

export default App;
