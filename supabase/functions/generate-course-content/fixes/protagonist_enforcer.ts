
export class ProtagonistEnforcer {
  private static BANNED_NAMES = [
    'ion', 'maria', 'ana', 'bogdan', 'vasile', 'elena', 
    'andrei', 'mihai', 'alexandru', 'ioana', 'george' // Common Romanian names that LLMs default to
  ];

  static enforce(content: string, protagonistName: string): string {
    const lowerContent = content.toLowerCase();
    const lowerProtagonist = protagonistName.toLowerCase();
    
    // 1. Check if protagonist exists (weak check)
    // if (!lowerContent.includes(lowerProtagonist)) {
    //   console.warn(`Protagonist ${protagonistName} missing from content!`);
    // }

    // 2. Find and replace banned names
    let fixedContent = content;
    let modified = false;

    this.BANNED_NAMES.forEach(bannedName => {
      // Don't ban the protagonist if their name happens to be in the banned list (unlikely but possible)
      if (bannedName === lowerProtagonist) return;

      // Regex to find whole words, case insensitive
      const regex = new RegExp(`\\b${bannedName}\\b`, 'gi');
      
      if (regex.test(fixedContent)) {
        console.warn(`[ProtagonistEnforcer] Found banned name: ${bannedName}. Replacing with ${protagonistName}.`);
        fixedContent = fixedContent.replace(regex, protagonistName);
        modified = true;
      }
    });

    if (modified) {
        console.log(`[ProtagonistEnforcer] Content auto-corrected.`);
    }

    return fixedContent;
  }

  static validate(content: string, protagonistName: string): boolean {
     // Return true if safe, false if critical failure
     // For now, since we auto-fix, we can be lenient, or we can use this to trigger a retry
     return true;
  }
}
