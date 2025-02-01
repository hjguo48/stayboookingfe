const domain = "https://staybooking-166041698865.us-west1.run.app"

export const login = (credentials) => {
    const loginUrl = `${domain}/auth/login`
    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
}