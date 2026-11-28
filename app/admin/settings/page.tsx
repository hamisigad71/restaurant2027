"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import {
  BuildingStorefrontIcon,
  BellIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <BuildingStorefrontIcon />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellIcon />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <PaintBrushIcon />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="regional">
              <GlobeAltIcon />
              Regional
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Profile</CardTitle>
                <CardDescription>Core identity and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="restaurantName">Restaurant Name</FieldLabel>
                    <Input
                      id="restaurantName"
                      defaultValue="Resto Grande Cuisine"
                      className="max-w-md font-semibold"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                    <Input
                      id="tagline"
                      defaultValue="Authentic African Cuisine"
                      className="max-w-md"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input
                      id="phone"
                      defaultValue="+254 712 345 678"
                      className="max-w-md"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="info@urbankitchen.co.ke"
                      className="max-w-md"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <Input
                      id="address"
                      defaultValue="123 Kenyatta Avenue, Nairobi"
                      className="max-w-md"
                    />
                  </Field>
                </FieldGroup>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-4">Business Hours</h3>
                  <div className="grid gap-4 max-w-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monday - Friday</span>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="08:00" className="w-24" />
                        <span className="text-muted-foreground">to</span>
                        <Input defaultValue="22:00" className="w-24" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Saturday - Sunday</span>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="10:00" className="w-24" />
                        <span className="text-muted-foreground">to</span>
                        <Input defaultValue="23:00" className="w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Orders</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a new order is placed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Ready</p>
                    <p className="text-sm text-muted-foreground">
                      Alert when kitchen marks order as ready
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Warning when inventory runs low
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Summary</p>
                    <p className="text-sm text-muted-foreground">
                      Receive daily sales summary via email
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sound Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Play sound for important alerts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the dashboard
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Reduce spacing for more content
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Animations</p>
                    <p className="text-sm text-muted-foreground">
                      Enable UI animations and transitions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Configure regional and localization options</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="currency">Currency</FieldLabel>
                    <Input
                      id="currency"
                      defaultValue="KES (Kenyan Shilling)"
                      disabled
                      className="max-w-md"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                    <Input
                      id="timezone"
                      defaultValue="Africa/Nairobi (EAT)"
                      disabled
                      className="max-w-md"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="dateFormat">Date Format</FieldLabel>
                    <Input
                      id="dateFormat"
                      defaultValue="DD/MM/YYYY"
                      className="max-w-md"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="taxRate">VAT Rate (%)</FieldLabel>
                    <Input
                      id="taxRate"
                      type="number"
                      defaultValue="16"
                      className="max-w-md"
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            <CheckBadgeIcon className="size-4" />
            {isSaving ? "Saving..." : "Apply Global Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
