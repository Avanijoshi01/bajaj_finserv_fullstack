/**
 * Data processing utility for BFHL API
 * Handles all the business logic for processing input arrays
 */

class DataProcessor {
  /**
   * Process the input data array and return categorized results
   * @param {string[]} data - Input array of strings
   * @returns {Object} Processed data with all required fields
   */
  static processData(data) {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Input must be an array');
      }

      const numbers = [];
      const alphabets = [];
      const specialChars = [];

      // Categorize each element
      data.forEach(item => {
        if (this.isNumber(item)) {
          numbers.push(item);
        } else if (this.isAlphabet(item)) {
          alphabets.push(item.toUpperCase());
        } else {
          specialChars.push(item);
        }
      });

      // Separate even and odd numbers
      const evenNumbers = numbers.filter(num => parseInt(num) % 2 === 0);
      const oddNumbers = numbers.filter(num => parseInt(num) % 2 === 1);

      // Calculate sum of numbers
      const sum = numbers.reduce((acc, num) => acc + parseInt(num), 0);

      // Generate concatenated string with alternating caps in reverse order
      const concatString = this.generateConcatString(alphabets);

      return {
        odd_numbers: oddNumbers,
        even_numbers: evenNumbers,
        alphabets: alphabets,
        special_characters: specialChars,
        sum: sum.toString(),
        concat_string: concatString
      };
    } catch (error) {
      console.error('Data processing error:', error);
      throw new Error(`Data processing failed: ${error.message}`);
    }
  }

  /**
   * Check if a string represents a valid number
   * @param {string} str - String to check
   * @returns {boolean} True if string is a number
   */
  static isNumber(str) {
    if (typeof str !== 'string') return false;
    return !isNaN(str) && !isNaN(parseFloat(str)) && str.trim() !== '';
  }

  /**
   * Check if a string contains only alphabetic characters
   * @param {string} str - String to check
   * @returns {boolean} True if string contains only alphabets
   */
  static isAlphabet(str) {
    if (typeof str !== 'string') return false;
    return /^[a-zA-Z]+$/.test(str);
  }

  /**
   * Generate concatenated string with alternating caps in reverse order
   * @param {string[]} alphabets - Array of uppercase alphabets
   * @returns {string} Concatenated string with alternating caps
   */
  static generateConcatString(alphabets) {
    if (!Array.isArray(alphabets) || alphabets.length === 0) return '';

    try {
      // Join all alphabets and reverse the string
      const reversedString = alphabets.join('').split('').reverse().join('');
      
      // Apply alternating caps
      return reversedString
        .split('')
        .map((char, index) => {
          return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
        })
        .join('');
    } catch (error) {
      console.error('Error generating concat string:', error);
      return '';
    }
  }

  /**
   * Generate user ID in the required format
   * @param {string} fullName - Full name of the user
   * @returns {string} User ID in format: fullname_ddmmyyyy
   */
  static generateUserId(fullName = 'john_doe') {
    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      
      return `${fullName.toLowerCase()}_${day}${month}${year}`;
    } catch (error) {
      console.error('Error generating user ID:', error);
      return 'john_doe_01012025'; // fallback
    }
  }

  /**
   * Get user information (mock data for demonstration)
   * @returns {Object} User information
   */
  static getUserInfo() {
    return {
      email: 'john@xyz.com',
      roll_number: 'ABCD123'
    };
  }
}

module.exports = DataProcessor;
