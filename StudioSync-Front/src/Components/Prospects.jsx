import Nav from './Nav'
import { useState, useEffect, useContext } from 'react'
import { UserContext, BASE_URL } from '../App'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default function Prospects() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [allProspects, setAllProspects] = useState([])
    const [sortType, setSortType] = useState('ABC')
    const [sortDirection, setSortDirection] = useState('ascending')

    const navigate = useNavigate()

    useEffect(() => {
        const getProspects = async () => {
            const response = await axios.get(`${BASE_URL}/prospects/get/all`)
            setAllProspects(response.data)
        }
        getProspects()
    }, [])

    useEffect(() => {
        const filteredResults = allProspects.filter(
            result => 
                result.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setSearchResults(filteredResults)
    }, [searchQuery, allProspects])

    const handleSort = (newSortType) => {
        if (newSortType === sortType) {
            setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
        } else {
            setSortType(newSortType);
            setSortDirection('ascending');
        }
    }

    const handleChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const sortedProspects = searchResults.slice().sort((a, b) => {
        if(searchResults.length < 2) {
            return searchResults
        }
        switch (sortType) {
            case 'ABC':
                return sortDirection === 'ascending' ? a.contact_name.localeCompare(b.contact_name) : b.contact_name.localeCompare(a.contact_name);
            case 'Stage':
                return sortDirection === 'ascending' ? a.stage.localeCompare(b.stage) : b.stage.localeCompare(a.stage);
            case 'Probability':
                return sortDirection === 'ascending' ? a.probability - b.probability : b.probability - a.probability;
            case 'Value':
                return sortDirection === 'ascending' ? a.projected_value - b.projected_value : b.projected_value - a.projected_value;
            case 'Created':
                return sortDirection === 'ascending' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt);
            default:
                return 0;
        }
    })

    const handleSelection = (prospect) => {
        navigate(`/prospects/${prospect._id}`)
    }

    return(
        <div>
            <h1 className='page-title'>Prospects</h1>
            <Nav />
            <div className="prospects-page">
                <div className="prospect-settings">
                    <h2 className="prospect-settings-title">Prospects</h2>
                </div>
                <div className="search-bar">
                    <div className="search-bar-container">
                        <input type="text" className="search-input" placeholder="Search Prospects..." value={searchQuery} onChange={handleChange}/>
                    </div>
                </div>
                <div className="utilities-bar">
                    <h4 className='sort-label'>Sort By:</h4>
                    <p className='sort-button' onClick={() => handleSort('ABC')}>ABC</p>
                    <p className='sort-button' onClick={() => handleSort('Stage')}>Stage</p>
                    <p className='sort-button' onClick={() => handleSort('Probability')}>Probability</p>
                    <p className='sort-button' onClick={() => handleSort('Value')}>Value</p>
                    <p className='sort-button' onClick={() => handleSort('Created')}>Created</p>
                </div>
                {sortedProspects ? (
                        sortedProspects.length > 0 ? (
                            sortedProspects.map((prospect) => (
                            <div className={`prospect-item ${prospect.probability === 0 ? 'item-prospect' : prospect.probability === 30 ? 'item-unlikely' : prospect.probability === 50 ? 'item-possible' : prospect.probability === 90 ? 'item-likely' : prospect.probability === 100 ? 'item-closed' : ''}`} key={prospect._id} onClick={() => handleSelection(prospect)}>
                                <div className="prospect-name">
                                    <h3>{prospect.contact_name}</h3>
                                </div>
                                <div className='prospect-quick-details'>
                                    <p className='quick-email'>{prospect.email}</p>
                                    <p className={`quick-stage ${prospect.stage === 'Unqualified' ? 'unqualified' : prospect.stage === 'Qualified' ? 'qualified' : prospect.stage === 'Proposal' ? 'proposal' : prospect.stage === 'Negotiation' ? 'negotiation' : prospect.stage === 'Closed' ? 'won' : ''}`}>
                                        {prospect.stage}</p>
                                    <p className={`quick-probability ${prospect.probability === 0 ? 'prospect' : prospect.probability === 30 ? 'unlikely' : prospect.probability === 50 ? 'possible' : prospect.probability === 90 ? 'likely' : prospect.probability === 100 ? 'won' : ''}`}>{prospect.probability}%</p>
                                    <p className='quick-value'>${prospect.projected_value}</p>
                                    <p className='quick-created'>{moment(prospect.createdAt).fromNow()}</p>
                                </div>
                            </div>)
                            )
                        ) : (
                            <div className="prospect-item">
                                <div className="prospect-name">
                                    <h2>Loading...</h2>
                                </div>
                            </div>
                            ) 
                        ) : (
                            <div className="prospect-item">
                                <div className="prospect-name">
                                    <h2>No prospects found.</h2>
                                </div>
                            </div>
                        )}
            </div>
        </div>
    )
}