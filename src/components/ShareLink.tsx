import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import { AggregatedProgress } from '../types/AggregatedProgress';
import '../styles/index.css';

interface ShareLinkProps {
  progressData: AggregatedProgress | null;
}

const ShareLink: React.FC<ShareLinkProps> = ({ progressData }) => {
  const [shareLink, setShareLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLink = async () => {
    try {
      const response = await axios.post('/api/progress/generateLink', progressData);
      setShareLink(response.data.link);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
        .then(() => setCopySuccess(true))
        .catch(() => setError('Failed to copy link.'));
    }
  };

  return (
    <Box className="share-link">
      {error && <Alert severity="error">{error}</Alert>}
      {copySuccess && (
          <Alert severity="success">Link copied to clipboard!</Alert>
      )}
      {!shareLink && (
        <Button variant="contained" onClick={generateLink}>
          Generate Share Link
        </Button>
      )}
      {shareLink && (
        <>
          <Typography variant="body1">Share this link:</Typography>
          <Box mt={1}>
            <Typography variant="body2" className="shareable-link">
              {shareLink}
            </Typography>
            <Tooltip title={copySuccess ? 'Copied!' : 'Copy'}>
              <IconButton aria-label="copy" onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ShareLink;