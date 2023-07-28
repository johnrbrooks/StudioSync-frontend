import { useState } from 'react'
import ReactLoading from 'react-loading'

export default function DeleteUserModal({ show, onCancel, onConfirm }) {

  const [isDeleting, setIsDeleting] = useState(false)

    if (!show) return null

    const handleConfirm = async () => {
      setIsDeleting(true)
      setTimeout(() => {
        onConfirm()
        setIsDeleting(false)
      }, 1500)
    }
  
    return (
      <div className="modal">
        <div className="modal-content">
          {isDeleting ? (
            <ReactLoading type="bars" color="#0400D9" height={50} width={50} />
          ) : (
            <div>
              <h3>Are you sure you want to delete this user and all its prospects?</h3>
              <div className="modal-buttons">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={handleConfirm}>Confirm</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }