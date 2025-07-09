import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing and using Hello Po, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
              <p className="text-gray-700">
                Permission is granted to temporarily download one copy of Hello Po for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
              <p className="text-gray-700">
                The materials on Hello Po are provided on an 'as is' basis. Hello Po makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Limitations</h2>
              <p className="text-gray-700">
                In no event shall Hello Po or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Hello Po, even if Hello Po or a Hello Po authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Privacy Policy</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at: carlo89512@yahoo.com
              </p>
            </section>

            <div className="text-sm text-gray-500 mt-8 pt-4 border-t">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
