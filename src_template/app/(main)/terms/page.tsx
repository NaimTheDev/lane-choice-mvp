
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Legal Documents</h1>

      <Card>
        <CardHeader>
          <CardTitle id="acceptable-use">
            Acceptable Use &amp; User Conduct Agreement – Lane Choice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>By using Lane Choice, you agree to the following:</p>

          <h3 className="font-semibold text-foreground">Purpose of the App</h3>
          <p>
            Lane Choice is intended to connect people who share a passion for
            cars, promote positive social interaction, and support the
            organization and discovery of automotive-related events. It is a
            community built on respect, safety, and shared interests.
          </p>

          <h3 className="font-semibold text-foreground">Prohibited Use</h3>
          <p>You agree that you will not use Lane Choice:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              To promote, plan, or engage in any form of violence, harassment,
              or harm toward individuals, groups, or property;
            </li>
            <li>
              To organize or incite illegal activities, street racing, property
              damage, or unsafe gatherings;
            </li>
            <li>
              To threaten, stalk, impersonate, or otherwise abuse other users;
            </li>
            <li>
              To upload or distribute content that is defamatory, obscene,
              hateful, or otherwise inappropriate;
            </li>
            <li>
              To misuse the platform for any reason that contradicts its
              intended purpose.
            </li>
          </ul>

          <h3 className="font-semibold text-foreground">
            Safety and Responsibility
          </h3>
          <p>You acknowledge and agree that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You are solely responsible for your conduct both on and off the
              platform;
            </li>
            <li>
              Lane Choice is not liable for any damages, injuries, or incidents
              that occur at user-organized events or through user interactions;
            </li>
            <li>
              You will exercise judgment and prioritize safety when interacting
              with other users or attending events.
            </li>
          </ul>

          <h3 className="font-semibold text-foreground">
            Enforcement and Termination
          </h3>
          <p>Lane Choice reserves the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Remove any content or user accounts that violate this agreement;
            </li>
            <li>Report unlawful activity to authorities if necessary;</li>
            <li>
              Suspend or permanently ban users who engage in harmful or
              destructive behavior.
            </li>
          </ul>

          <p className="pt-4 font-semibold">
            By creating an account or using Lane Choice, you confirm that you
            have read, understood, and agree to abide by this Acceptable Use
            &amp; User Conduct Agreement.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle id="terms-and-conditions">Terms and Conditions of Use</CardTitle>
          <p className="text-sm text-muted-foreground pt-1">
            Effective Date: [Insert Date]
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to Lane Choice (“App”, “we”, “us”, or “our”). These Terms and
            Conditions (“Terms”) govern your use of the Lane Choice mobile
            application and related services. By downloading, installing, or
            using the App, you agree to be bound by these Terms. If you do not
            agree, please do not use the App.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1. User Agreement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            By using Lane Choice, you affirm that you are at least 18 years old
            (or the age of majority in your jurisdiction) and capable of
            entering into a binding agreement. If you are using the App on behalf
            of an organization, you represent that you have the authority to
            bind that organization.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>To use certain features, you may need to create an account. You agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information;</li>
            <li>Keep your login credentials secure;</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Prohibited Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the App for any illegal purpose;</li>
            <li>
              Upload or transmit harmful, offensive, or unlawful content;
            </li>
            <li>Attempt to reverse engineer, decompile, or hack the App;</li>
            <li>
              Violate the rights of others, including intellectual property or
              privacy rights;
            </li>
            <li>
              Use bots, scrapers, or other automated systems to access the App.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            All content, features, and functionality in Lane Choice, including
            but not limited to software, logos, text, graphics, and audio, are
            the property of Lane Choice or its licensors and are protected by
            U.S. and international copyright, trademark, and other intellectual
            property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable,
            revocable license to use the App for personal, non-commercial use in
            accordance with these Terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Third-Party Content and Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The App may contain links to third-party websites or services. We do
            not control and are not responsible for third-party content. Your
            interactions with third parties are solely between you and the third
            party.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Disclaimer of Warranties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The App is provided “as is” and “as available” without warranties of
            any kind, either express or implied. We do not warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The App will be uninterrupted or error-free;</li>
            <li>Any data will be accurate or reliable;</li>
            <li>The App will meet your expectations or requirements.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            To the fullest extent permitted by law, Lane Choice shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of the App, including but
            not limited to loss of data, profits, or business opportunities.
          </p>
          <p>
            Our total liability for any claim arising from these Terms or the
            App will not exceed $100.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Indemnification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            You agree to defend, indemnify, and hold harmless Lane Choice, its
            affiliates, officers, and employees from and against any claims,
            liabilities, damages, losses, and expenses (including attorneys’
            fees) arising out of or related to your use of the App, violation of
            these Terms, or infringement of any rights of a third party.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Termination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We may suspend or terminate your access to the App at any time,
            without notice, for conduct that we believe violates these Terms or
            is harmful to other users or us.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Governing Law and Dispute Resolution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            These Terms are governed by the laws of the State of New Jersey,
            without regard to conflict of law principles.
          </p>
          <p>
            Any disputes arising out of or relating to these Terms shall be
            resolved through binding arbitration in accordance with the rules of
            the American Arbitration Association (AAA). The arbitration shall
            take place in Toms River, New Jersey, and judgment on the award may
            be entered in any court of competent jurisdiction.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>11. Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We reserve the right to update or modify these Terms at any time.
            Changes will be effective upon posting. Continued use of the App
            after changes indicates acceptance of the revised Terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>12. Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>Email: support@lanechoice.com</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>Lane Choice™ © 2025 – All Rights Reserved.</p>
        </CardContent>
      </Card>
    </div>
  );
}
