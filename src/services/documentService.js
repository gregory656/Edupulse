// Note: PDF parsing removed due to browser compatibility issues with pdf-parse
// Only TXT and DOCX files are currently supported

import mammoth from 'mammoth';

// Extract text from DOCX file
export const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
};

// Extract text from TXT file
export const extractTextFromTXT = async (file) => {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Error reading TXT file:', error);
    throw new Error('Failed to read text file');
  }
};

// Main function to extract text from any supported file type
export const extractTextFromFile = async (file) => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // Check by MIME type first, then fallback to file extension
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    throw new Error('PDF files are not currently supported due to browser compatibility issues. Please upload DOCX or TXT files instead.');
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return await extractTextFromDOCX(file);
  } else if (
    fileType === 'text/plain' ||
    fileName.endsWith('.txt')
  ) {
    return await extractTextFromTXT(file);
  } else {
    throw new Error('Unsupported file type. Please upload DOCX or TXT files.');
  }
};

// Validate file before processing
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const allowedExtensions = ['.docx', '.txt'];

  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  const fileName = file.name.toLowerCase();
  const hasAllowedType = allowedTypes.includes(file.type);
  const hasAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!hasAllowedType && !hasAllowedExtension) {
    throw new Error('Unsupported file type. Please upload DOCX or TXT files.');
  }

  return true;
};