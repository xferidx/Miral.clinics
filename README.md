# مركز الميرال — Almiral Center

1. Open `index.html` and fill the `window.CENTER` block near the top (phones, WhatsApp, Instagram, address, map link). Empty fields stay hidden.
2. Create a NEW Firebase project for this center (Firestore + Authentication: Anonymous and Email/Password), then paste its web config into both `index.html` and `records.html` (search for `PASTE_YOUR_API_KEY_HERE`).
3. Set strict Firestore rules so patient records are readable only by signed-in staff.
4. Upload all files to a new GitHub repo and enable GitHub Pages.

Patient and waiting counts start at zero: data is stored per Firebase project under `almiral-center`.
