import Nav from './Nav'
import { useState, useEffect, useContext } from 'react'
import { BASE_URL, UserContext } from '../App'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

export default function DataOverview() {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, userProspects, setUserProspects, allProspects, setAllProspects } = useContext(UserContext)

    //Resets currentUser/login data if page refreshes
    useEffect(() => {
        if(!currentUser) {
            const retrievedUser = JSON.parse(sessionStorage.getItem("currentUser"))
            const retrievedIsLoggedIn =  JSON.parse(sessionStorage.getItem("isLoggedIn"))
            const retreivedProspects = JSON.parse(sessionStorage.getItem("userProspects"))
            setAllProspects(retreivedProspects)
            setCurrentUser(retrievedUser)
            setIsLoggedIn(retrievedIsLoggedIn)
        }
    }, [currentUser, isLoggedIn])

    const [prospectsStageData, setProspectsStageData] = useState([])
    const [prospectsProbabilityData, setProspectsProbabilityData] = useState([])
    const [prospectsServicesData, setProspectsServicesData] = useState([])
    const [countThreshold, setCountThreshold] = useState()
    const [backgroundColors, setBackgroundColors] = useState() 
    const [stageColors, setStageColors] = useState() 

    const [potentialSales, setPotentialSales] = useState()
    const [weightedSales, setWeightedSales] = useState()
    const [closedSales, setClosedSales] = useState()
    const [percentClosed, setPercentClosed] = useState()
    const [highestProspect, setHighestProspect] = useState()
    const [lowestProspect, setLowestProspect] = useState()

    //Set the state of the charts
    const[serviceData, setServiceData] = useState({
        labels: [],
        datasets: [{
            label: 'Services Requested',
            data: []
        }]
    })

    const[stageData, setStageData] = useState({
        labels: [],
        datasets: [{
            label: 'Prospect Stage Distribution',
            data: []
        }]
    })

    const[probabilityData, setProbabilityData] = useState({
        labels: [],
        datasets: [{
            label: 'Prospect Probability Distribution',
            data: []
        }]
    })

    //Count the instances of each stage value and set to state 
    useEffect(() => {
        const stageData = allProspects.flatMap((prospect) => prospect.stage)
        const stageCounts = stageData.reduce((acc, stage) => {
            acc[stage] = (acc[stage] || 0) + 1
            return acc
        }, [])
        const stageCountsArray = Object.entries(stageCounts).map(([stage, count]) => ({
            stage,
            count,
        }))
        setProspectsStageData(stageCountsArray)
        determineStageColors(stageCountsArray)

    }, [allProspects])

    //Set the Stage data values to build chart
    useEffect(() => {
        setStageData({
            labels: prospectsStageData.map((item) => item.stage),
            datasets: [{
                label: 'Prospect Stage Distribution',
                data: prospectsStageData.map((item) => item.count),
                backgroundColor: stageColors
            }]
        })
    }, [prospectsStageData, stageColors])

    //Count the instances of each probability value and set to state 
    useEffect(() => {
        const probabilityData = allProspects.flatMap((prospect) => prospect.probability)
        const probabilityCounts = probabilityData.reduce((acc, probability) => {
            acc[probability] = (acc[probability] || 0) + 1
            return acc
        }, [])
        const probabilityCountsArray = Object.entries(probabilityCounts).map(([probability, count]) => ({
            probability,
            count,
        }))
        setProspectsProbabilityData(probabilityCountsArray)

    }, [allProspects])

    //Set the probability data to build chart
    useEffect(() => {
        setProbabilityData({
            labels: prospectsProbabilityData.map((item) => item.probability),
            datasets: [{
                label: 'Prospect Probability Distribution',
                data: prospectsProbabilityData.map((item) => item.count),
                backgroundColor: [
                    'rgb(153, 212, 236)',
                    'rgb(143, 143, 255)',
                    'rgb(74, 74, 255)',
                    'rgb(4, 0, 217)',
                    'rgb(0, 0, 106)',
                ]
            }]
        })
    }, [prospectsProbabilityData])

    //Count the instances of each service and set to state
    useEffect(() => {
        const servicesItems = allProspects.flatMap((prospect) => prospect.interested_services)
        setProspectsServicesData(servicesItems)
        const serviceCounts = servicesItems.reduce((acc, service) => {
            acc[service] = (acc[service] || 0) + 1
            return acc
        }, [])
        const serviceCountsArray = Object.entries(serviceCounts).map(([service, count]) => ({
            service,
            count,
        }))
        setServiceCountsArray(serviceCountsArray)
        
        determineDataMedian(serviceCountsArray)
        determineColors()

    }, [allProspects, countThreshold])

    const [serviceCountsArray, setServiceCountsArray] = useState([])

    //Set the service data to build chart
    useEffect(() => {
        setServiceData({
            labels: serviceCountsArray.map((item) => item.service),
            datasets: [
                {
                    label: 'Most requested',
                    data: serviceCountsArray.map((item) => item.count),
                    backgroundColor: backgroundColors,
                },
            ],
        })
    }, [prospectsServicesData, backgroundColors])
        
    //Run functions to determine data for Sales Analytics
    useEffect(() => {
        determinePotentialSales()
        determineWeightedSales()
        determinePercentClosed()
        determineMaxMinProspects()
        determineClosedTotal()
    }, [allProspects])
    
    const determineDataMedian = (dataCategory) => {
        const values = dataCategory.map((value) => value.count)
        let sum = 0
        values.forEach((number) => {
            sum += number
        })
        const threshold = sum / values.length
        setCountThreshold(threshold)
    }

    const determineColors = () => {
        const colors = serviceCountsArray.map((value) => {
            return value.count > countThreshold ? 'rgba(0, 158, 0, 1)' : 'rgba(164, 0, 0, 1)'
        })
        setBackgroundColors(colors)
    }

    const determineStageColors = (stageCountsArray) => {
        const colors = stageCountsArray.map((prospect) => {
            return prospect.stage === 'Unqualified' ? 'rgb(164, 0, 0)' : prospect.stage === 'Qualified' ? 'rgb(205, 133, 0)' : prospect.stage === 'Proposal' ? 'rgb(73, 213, 73)' : prospect.stage === 'Negotiation' ? 'rgb(0, 158, 0)' : prospect.stage === 'WIP' ? 'rgb(0, 97, 0)' : prospect.stage === 'Closed' ? 'rgb(164, 0, 0)' : ''
        })
        setStageColors(colors)
    }

    const determinePotentialSales = () => {
        let projectedSales = 0
        const openProspects = allProspects.filter((prospect) => prospect.stage !== 'WIP')
        const projectedValuesArray = openProspects.flatMap((prospect) => prospect.projected_value)
        projectedValuesArray.forEach((number) => {
            projectedSales += number
        })
        const formattedSales = projectedSales.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        })
        setPotentialSales(formattedSales)
    }

    const determineWeightedSales = () => {
        let projectedSales = 0
        const openProspects = allProspects.filter((prospect) => prospect.stage !== 'WIP')
        const projectedValuesArray = openProspects.flatMap((prospect) => prospect.projected_value)
        const prospectsProbabilityArray = openProspects.flatMap((prospect) => {
            return prospect.probability !== 0 ? prospect.probability / 100 : prospect.probability
        })
        const weightedSalesArray = projectedValuesArray.map((value, index) => {
            return value * prospectsProbabilityArray[index];
        })
        weightedSalesArray.forEach((number) => {
            projectedSales += number
        })
        const formattedSales = projectedSales.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        })
        setWeightedSales(formattedSales)
    }

    const determinePercentClosed = () => {
        const openProspects = allProspects.filter((prospect) => prospect.stage !== 'WIP' || 'Closed')
        const closedProspects = allProspects.filter((prospect) => prospect.stage === 'WIP')
        if(openProspects.length > 0 && openProspects.length !== 1) {
            const percentClosedValue = (closedProspects.length/openProspects.length) * 100
            const roundedValue = percentClosedValue.toFixed(2)
            setPercentClosed(parseFloat(roundedValue))
        } else if(closedProspects.length > 0 && openProspects.length === 0) {
            setPercentClosed(100)
        } else if(openProspects.length === 1 && closedProspects.length === 1) {
            setPercentClosed(50)
        } else if(closedProspects.length === 0) {
            setPercentClosed(0)
        }
    }

    const determineClosedTotal = () => {
        let totalSales = 0
        const closedProspects = allProspects.filter((prospect) => prospect.stage === 'WIP')
        const closedValuesArray = closedProspects.flatMap((prospect) => prospect.projected_value)
        closedValuesArray.forEach((number) => {
            totalSales += number
        })
        const formattedTotalSales = totalSales.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        })
        setClosedSales(formattedTotalSales)
    }

    const determineMaxMinProspects = () => {
        const projectedValuesArray = allProspects.flatMap((prospect) => prospect.projected_value)
        const highestValue = Math.max(...projectedValuesArray)
        const lowestValue = Math.min(...projectedValuesArray)
        const highestValueProspect = allProspects.find((prospect) => prospect.projected_value === highestValue);
        const lowestValueProspect = allProspects.find((prospect) => prospect.projected_value === lowestValue);
        setHighestProspect(highestValueProspect)
        setLowestProspect(lowestValueProspect)
    }

    return (
        <div>
            <h1 className='page-title'>Data Overview</h1>
            <Nav />
            <div className="dashboard-page">
                <div className="prospect-headers page-header">
                    <div className="prospect-name">
                        <h2>Data Overview</h2>
                    </div>
                </div>
                <div className="charts-page-container">
                    <h1 className="data-page-title">Sales Analytics</h1>
                    <div className="sum-data-grid">
                        <h3 className="sum-data-title">Won Sales:</h3>
                        <p className="sum-data-value">{closedSales}</p>
                        <h3 className="sum-data-title">Potential Sales:</h3>
                        <p className="sum-data-value">{potentialSales}</p>
                        <h3 className="sum-data-title">Weighted Sales:</h3>
                        <p className="sum-data-value">{weightedSales}</p>
                        <h3 className="sum-data-title">Percent Won:</h3>
                        <p className={`sum-data-value ${percentClosed >= 50 ? 'good' : 'bad'}`}>{percentClosed}%</p>
                        <h3 className="sum-data-title">Highest Value Prospect:</h3>
                        <p className="sum-data-value">{highestProspect ? `${highestProspect.contact_name} (${highestProspect.projected_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : 'N/A'}</p>
                        <h3 className="sum-data-title">Lowest Value Prospect:</h3>
                        <p className="sum-data-value">{lowestProspect ? `${lowestProspect.contact_name} (${lowestProspect.projected_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : 'N/A'}</p>
                    </div>
                    <div className="charts-grid">
                        <div className="probability-chart-data">
                            <h2 className="chart-title">Prospects by Probability</h2>
                            {allProspects.length !== 0 || probabilityData === undefined ? <Pie data={probabilityData} /> : <h3 className='data-error'>Not enough data.</h3>}
                        </div>
                        <div className="stage-chart-data">
                            <h2 className="chart-title">Prospects by Stage</h2>
                            {allProspects.length !== 0 || stageData === undefined ? <Pie data={stageData} /> : <h3 className='data-error'>Not enough data.</h3>}
                        </div>
                    </div>
                    <div className="bar-chart">
                        <div className="services-chart-data">
                            <h2 className="chart-title">Prospects by Service</h2>
                            {allProspects.length !== 0 || serviceData === undefined ? <Bar data={serviceData} /> : <h3 className='data-error'>Not enough data.</h3>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}