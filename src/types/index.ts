export type ContentType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'calendar' | 'location' | 'crypto';

export interface QRCodeSettings {
  size: number;
  fgColor: string;
  bgColor: string;
  level: string;
  includeMargin: boolean;
  cornerType: string;
  style: string;
  gradient: {
    enabled: boolean;
    type: 'linear' | 'radial';
    colors: string[];
    rotation: number;
  };
  pattern: {
    enabled: boolean;
    type: 'dots' | 'squares' | 'rounded' | 'classy' | 'classyRounded';
    color: string;
  };
  frame: {
    enabled: boolean;
    style: 'simple' | 'rounded' | 'fancy';
    text: string;
    textColor: string;
  };
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
    borderRadius: number;
    margin: number;
  };
}