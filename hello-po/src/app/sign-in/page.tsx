// Completely isolated sign-in page - NO IMPORTS from our modules
export default function SignInPage() {
  console.log("ISOLATED Sign-in page loaded");
  
  return (
    <html lang="en">
      <head>
        <title>Sign In - Test</title>
        <style>{`
          body { 
            margin: 0; 
            font-family: Arial, sans-serif; 
            background: #f5f5f5; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
          }
          .container { 
            background: white; 
            padding: 2rem; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            width: 100%; 
            max-width: 400px; 
          }
          .form-group { 
            margin-bottom: 1rem; 
          }
          label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: bold; 
          }
          input { 
            width: 100%; 
            padding: 0.75rem; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            font-size: 1rem; 
          }
          button { 
            width: 100%; 
            padding: 0.75rem; 
            background: #007bff; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            font-size: 1rem; 
            cursor: pointer; 
          }
          button:hover { 
            background: #0056b3; 
          }
          h1 { 
            text-align: center; 
            margin-bottom: 2rem; 
            color: #333; 
          }
          .debug { 
            position: fixed; 
            top: 10px; 
            right: 10px; 
            background: red; 
            color: white; 
            padding: 10px; 
            border-radius: 4px; 
            font-size: 12px; 
          }
        `}</style>
      </head>
      <body>
        <div className="debug">
          ISOLATED PAGE - {new Date().toLocaleTimeString()}
        </div>
        <div className="container">
          <h1>Sign In (Isolated Test)</h1>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" />
            </div>
            <button type="submit">Sign In</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            This is a completely isolated page with NO React components, NO auth logic, NO external dependencies.
            If this STILL refreshes, the issue is in Vercel configuration.
          </div>
        </div>
      </body>
    </html>
  );
}
