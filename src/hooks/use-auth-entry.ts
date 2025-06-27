import { useState } from "react";
import { createAuthEntry, deleteEntry, getAuthEntries } from "../services/auth-entries.service";
import { AuthEntry, AuthEntryInput, EntryRole } from "../types/auth-entry";
import { authTerminal } from "../services/auth.service";
import { AuthResponse } from "../types/auth";
import useAsyncList from "./use-async-list";
import { getTerminals } from "../services/terminal.service";
import { Terminal } from "../types/terminal";
import { useSearchParams } from "react-router";

export default function useAuthEntry() {
    const [searchParams] = useSearchParams()
    const [patente, setPatente] = useState(searchParams.get('patente') || '');
    const [terminal, setTerminal] = useState<number | null>(searchParams.get('terminal') ? parseInt(searchParams.get('terminal') || '') : null);
    const [role, setRole] = useState<EntryRole>((searchParams.get('role') as EntryRole) || 'AA');
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [result, setResult] = useState<AuthResponse | null>(null);

    const { items: terminals } = useAsyncList<Terminal[]>(getTerminals)
    const { items: savedEntries, fetch: fetchEntries, loading: loadingEntries } = useAsyncList<AuthEntry[]>(getAuthEntries)

    const authenticate = async (authEntry?: AuthEntry) => {
        try {
            setIsLoading(true)
            setResult(null)
            const selectedTerminal = terminals.find(t => t.id === terminal)
            const response = await authTerminal(
                authEntry?.terminal?.code || selectedTerminal?.code || '',
                authEntry?.patente || patente,
                authEntry?.role || role
            )

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.message || 'An error occurred');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch {
            setError('Failed to connect to the server');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!patente || !terminal || !role) return;

        const newEntry: Partial<AuthEntryInput> = {
            patente,
            terminal,
            role,
        };

        try {
            setIsLoading(true)
            await createAuthEntry(newEntry)
            setShowToast(true);
            setSuccess('Entry saved successfully');
            fetchEntries()
            setTimeout(() => {
                setShowToast(false)
                setSuccess('')
            }, 2000);
        } catch (error) {
            console.log(error)
            setError('Error saving entry')
            setTimeout(() => {
                setShowToast(false)
                setError('')
            }, 2000);
        } finally {
            setIsLoading(false)
        }
    };

    const handleShare = () => {
    if (!patente || !terminal || !role) {
      setError('Please fill in both patente and terminal to share');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const currentUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${currentUrl}?patente=${encodeURIComponent(patente)}&terminal=${encodeURIComponent(terminal)}&role=${encodeURIComponent(role)}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSuccess('Share URL copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }).catch(() => {
      setError('Failed to copy URL to clipboard');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

    const handleDelete = async (id: number) => {
        try {
            await deleteEntry(id)
            fetchEntries()
        } catch (error) {
            console.log(error)
            setError('Error removing entry')
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        authenticate();
    };

    const handleTagClick = (entry: AuthEntry) => {
        setPatente(entry.patente);
        setTerminal(entry.terminal.id);
        setRole(entry.role);
        authenticate(entry);
    };

    const handleOpenLink = (link: string) => {
        window.open(link, '_blank')
    }

    const copyToClipboard = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);

        setShowToast(true);
        setSuccess('Copied!');
        setTimeout(() => {
            setShowToast(false)
            setSuccess('')
        }, 2000);
    };

    return {
        isLoading,
        loadingEntries,
        error,
        success,
        showToast,
        result,
        terminal,
        setTerminal,
        patente,
        setPatente,
        role,
        setRole,
        terminals,
        savedEntries,
        copyToClipboard,
        handleOpenLink,
        handleTagClick,
        handleDelete,
        handleSave,
        handleShare,
        handleSubmit
    }
}