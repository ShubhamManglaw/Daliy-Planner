
let token = null;

export const googleCalendarService = {
    // 1. Authenticate User
    authenticate: async () => {
        return new Promise((resolve, reject) => {
            if (typeof chrome === 'undefined' || !chrome.identity) {
                reject(new Error("Chrome Identity API not available (not running as extension?)"));
                return;
            }

            chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    token = authToken;
                    resolve(authToken);
                }
            });
        });
    },

    // 2. Sign Out / Revoke
    signOut: async () => {
        return new Promise((resolve) => {
            if (token) {
                chrome.identity.removeCachedAuthToken({ token: token }, () => {
                    token = null;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    },

    // 3. Create Event
    createEvent: async (task, date) => {
        if (!token) throw new Error("Not authenticated");

        const startDateTime = new Date(`${date}T${task.time !== '--:--' ? task.time : '09:00'}:00`).toISOString();
        const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(); // +1 hour

        const event = {
            summary: task.title,
            description: `Category: ${task.category}\nNotes: ${task.notes || ''}\n\nAdded via Daily Planner Extension`,
            start: {
                dateTime: startDateTime,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: endDateTime,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });

        if (!response.ok) {
            throw new Error(`Failed to create event: ${response.statusText}`);
        }

        return await response.json();
    }
};
