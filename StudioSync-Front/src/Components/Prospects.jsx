import Nav from './Nav'
import { useState } from 'react'

export default function Prospects() {

    const [formOpen, setFormOpen] = useState('')

    const handleSelection = (form) => {
        setFormOpen(form)
    }

    return(
        <div>
            <h1 className='page-title'>Prospects</h1>
            <Nav />
            <div className="prospects-page">
                <div className="prospect-settings">
                    <h2 className="prospect-settings-title">Prospect Settings</h2>
                </div>
                <div className="prospect-edit-buttons">
                    <button className="add-prospect" onClick={() => handleSelection('add prospect')}>Add Prospect</button>
                    <button className="edit-prospect" onClick={() => handleSelection('edit prospect')}>Edit Prospect</button>
                    <button className="delete-prospect" onClick={() => handleSelection('delete prospect')}>Delete Prospect</button>
                </div>
            </div>
            {formOpen === 'add prospect'}
        </div>
    )
}