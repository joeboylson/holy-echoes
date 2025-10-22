import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DevShowcase() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
          <p className="text-gray-600">Holy Echoes UI Components</p>
        </div>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Buttons</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="primary">Primary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Controls */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Form Controls</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Input</h3>
              <div className="space-y-3 max-w-md">
                <Input placeholder="Default input" />
                <Input placeholder="Disabled input" disabled />
                <Input type="password" placeholder="Password input" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Textarea</h3>
              <div className="max-w-md">
                <Textarea placeholder="Enter your text here..." rows={4} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Select</h3>
              <div className="max-w-md">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Switch</h3>
              <div className="flex items-center gap-3">
                <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                <span className="text-sm">Toggle me</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Checkbox</h3>
              <div className="flex items-center gap-3">
                <Checkbox checked={checkboxChecked} onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)} />
                <span className="text-sm">Check me</span>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the card content area where you can put any information.</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary">Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Another Card</CardTitle>
                <CardDescription>With different content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cards are flexible containers for grouping related content.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Tabs</h2>
          <Tabs defaultValue="tab1" className="max-w-md">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <p className="p-4 bg-white rounded-lg border">Content for tab 1</p>
            </TabsContent>
            <TabsContent value="tab2">
              <p className="p-4 bg-white rounded-lg border">Content for tab 2</p>
            </TabsContent>
            <TabsContent value="tab3">
              <p className="p-4 bg-white rounded-lg border">Content for tab 3</p>
            </TabsContent>
          </Tabs>
        </section>

        {/* Dialog */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Dialog</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description. Dialogs are useful for confirmations and forms.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here.</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </div>
  );
}
