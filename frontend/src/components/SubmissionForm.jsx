"use client";

import { useState } from "react";
import { axiosClient } from "@/utils/axios-client";

export default function SubmissionForm({ conferenceUserId, refetchSubmission }) {
    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [keywords, setKeywords] = useState('');
    const [authors, setAuthors] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('conference_user_id', conferenceUserId);
        formData.append('title', title);
        formData.append('abstract', abstract);
        keywords.split(',').map(k => k.trim()).forEach(keyword => {
            formData.append('keywords[]', keyword);
        });
        authors.split(',').map(a => a.trim()).forEach(author => {
            formData.append('authors[]', author);
        });
        
        formData.append('file', file);

        try {
            for (const pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }
            await axiosClient.post('/submission', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Soumission réussie !');
            refetchSubmission();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la soumission.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border rounded"
                required
            />
            <textarea
                placeholder="Résumé"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="p-2 border rounded"
                required
            />
            <input
                type="text"
                placeholder="Mots-clés (séparés par virgule)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="p-2 border rounded"
                required
            />
            <input
                type="text"
                placeholder="Auteurs (séparés par virgule)"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                className="p-2 border rounded"
                required
            />
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="p-2 border rounded"
                required
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded">
                Soumettre
            </button>
        </form>
    );
}
