// src/components/UploadProfilePhoto.jsx
import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
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
 * @param {boolean} [props.showCancel=false] - Zda zobrazit tlačítko pro zrušení nahrávání.
 * @param {function} [props.onCancel] - Callback vyvolaný po kliknutí na "Zrušit".
*/
const UploadProfilePhoto = ({ userId, onSuccess, showCancel = false, onCancel }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [processedFile, setProcessedFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    /**
     * Zpracovává výběr souboru uživatelem.
     *
     * @param {Event} event - Událost změny vstupu souboru.
     */
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setProcessedFile(null);
        setIsCropping(!!selectedFile);

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        // Vytvoření lokální URL pro náhled vybraného obrázku
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    };

    /**
     * Načte obrázek z URL a vrátí HTMLImageElement.
     *
     * @param {string} url - URL obrázku
     * @returns {Promise<HTMLImageElement>} - Načtený obrázek
     */
    const createImage = (url) => new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

    /**
     * Vytvoří soubor podle vybraného ořezu.
     *
     * @returns {Promise<File>} - Oříznutý obrázek
     */
    const getCroppedFile = async () => {
        const image = await createImage(preview);
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(new File([blob], 'cropped.jpg', { type: 'image/jpeg' }));
            }, 'image/jpeg');
        });
    };

    /**
     * Potvrdí ořez a vytvoří komprimovaný obrázek pro nahrání.
     */
    const handleCropConfirm = async () => {
        if (!croppedAreaPixels) {
            return;
        }
        try {
            const croppedFile = await getCroppedFile();
            const options = {
                maxWidthOrHeight: 800,
                initialQuality: 0.8,
                maxSizeMB: 0.2,
                useWebWorker: true,
            };
            const compressed = await imageCompression(croppedFile, options);
            setProcessedFile(compressed);
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(compressed));
            setIsCropping(false);
        } catch (error) {
            toast.error('Nepodařilo se zpracovat obrázek.');
            console.error('Crop error', error);
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

        if (!processedFile) {
            toast.warning('Nejdříve potvrď ořez.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', processedFile);

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
                <label htmlFor="photoUpload">Vyfoťte se:</label>
                <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {isCropping && preview && (
                <div className={styles.cropWrapper}>
                    <div className={styles.cropContainer}>
                        <Cropper
                            image={preview}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(c, pixels) => setCroppedAreaPixels(pixels)}
                        />
                    </div>
                    <div className={styles.cropControls}>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                        />
                        <SimpleButton text="Potvrdit ořez" onClick={handleCropConfirm} />
                    </div>
                </div>
            )}

            {!isCropping && preview && (
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
            {showCancel && (
                <SimpleButton
                    text="Zrušit"
                    onClick={onCancel}
                    type="button"
                />
            )}
        </div>
    );
};

export default UploadProfilePhoto;
