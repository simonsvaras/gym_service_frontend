// src/components/UploadProfilePhoto.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Importujte toast z react-toastify
import api from '../services/api.js';

import styles from './UploadProfilePhoto.module.css';
import SimpleButton from './SimpleButton';

/**
 * Komponenta pro nahrání profilové fotografie uživatele.
 *
 * @component
 * @param {Object} props - Vlastnosti komponenty.
 * @param {number} props.userId - ID uživatele, jehož profilová fotografie se nahrává.
 * @param {function} [props.onSuccess] - Callback vyvolaný po úspěšném nahrání.
*/
const UploadProfilePhoto = ({ userId, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Zpracovává výběr souboru uživatelem.
     *
     * @param {Event} event - Událost změny vstupu souboru.
     */
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        // Vytvoření lokální URL pro náhled vybraného obrázku
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    };

    /**
     * Čistící efekt pro uvolnění paměti zabrané object URL při změně souboru nebo odmontování komponenty.
     */
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    /**
     * Zpracovává nahrání vybraného souboru na server.
     *
     * @async
     */
    const handleUpload = async () => {
        if (!file) {
            toast.warning('Nejdříve vyber soubor.');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await api.post(`/users/${userId}/uploadProfilePicture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Zpracování varovného stavu, pokud API vrátí varování
            if (response.data.warning) {
                toast.warning(response.data.warning);
            } else {
                toast.success('Fotka úspěšně nahrána!');
            }
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error('Nahrání fotky se nezdařilo: ' + (error.response?.data?.error || error.message));
            console.error('Chyba při nahrávání fotky:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <h3>Nahraj svou profilovou fotografii</h3>

            <div className={styles.formGroup}>
                <label htmlFor="photoUpload">Vyber fotku:</label>
                <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {preview && (
                <div className={styles.previewContainer}>
                    <img
                        src={preview}
                        alt="Náhled fotky"
                        className={styles.previewImage}
                    />
                </div>
            )}

            <SimpleButton
                text={isLoading ? 'Nahrávám...' : 'Nahrát'} // Dynamický text tlačítka podle stavu nahrávání
                onClick={handleUpload}
                type="button"
                disabled={isLoading} // Zabránění vícenásobnému kliknutí během nahrávání
            />
        </div>
    );
};

export default UploadProfilePhoto;
