import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./imageModal.css"; // Tu peux y ajouter tes styles personnalisés

export default function ImageModal({ show, onClose, mot, imageUrl }) {
  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Image pour "{mot}"</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Illustration de ${mot}`}
                className="img-fluid rounded"
              />
            ) : (
              <p>Aucune image disponible pour ce mot.</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
      <div className="custom-backdrop" onClick={onClose}></div>
    </div>
  );
}
