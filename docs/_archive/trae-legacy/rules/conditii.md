RULE 1: DON'T INVENT
•    Don't assume a field exists without checking the code.
•    Don't assume a function is called without finding the explicit call.
•    If you're not sure, ask or check. Don't improvise.
•    When I say 'add', I mean add EXACTLY what I describe. Do not add other things 'because it might be useful'.
RULE 2: DO NOT TOUCH WHAT YOU ARE NOT ASKED TO
•    Modify ONLY the files and functions that I specify.
•    Do not refactor existing code 'to make it cleaner'.
•    Do not rename variables, functions, or files.
•    Do not add comments or console.logs outside the work area.
•    If you notice a bug elsewhere in the code, let me know. Do NOT fix it yourself.
RULE 3: CHECK BEFORE DECLARING THAT YOU ARE DONE
•    After each task, show me EXACTLY what you have modified (diff).
•	If the task requires 'inject X into the prompt', show me the final prompt generated with X included.
•    If the task requires 'check that Y appears in the output', run a test or simulate a call and show me the output.
•    DO NOT say 'I'm done, it should work'. Show me that it works.
RULE 4: BACKWARD COMPATIBILITY
•    Any new field in types.ts is OPTIONAL (with ?:).
•    Any new branch in rendering has a fallback to existing behavior.
•    If I change the DNA schema, existing DNAs in the database should NOT break.
•    Test: an existing course with old DNA must work identically after the change.
RULE 5: ONE PHASE AT A TIME
•    We work on one phase of the plan at a time. Do not jump to the next phase without

Translated with DeepL.com (free version)