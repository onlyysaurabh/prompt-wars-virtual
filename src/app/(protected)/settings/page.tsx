import { ProfileForm } from '@/components/forms/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionWrapper } from '@/components/motion-wrapper'

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-3xl mx-auto">
      <MotionWrapper delay={0.1}>
        <h1 className="text-4xl sm:text-5xl font-serif text-paper">Settings</h1>
        <p className="text-lg text-slate mt-2">Manage your account and preferences.</p>
      </MotionWrapper>
      
      <MotionWrapper delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-paper">Profile Information</CardTitle>
            <CardDescription className="text-slate">
              Update your profile to get more accurate carbon insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  )
}
