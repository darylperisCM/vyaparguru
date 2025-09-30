import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HomeButton } from '@/components/ui/home-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  ShoppingCart, 
  Stethoscope, 
  Truck, 
  Utensils, 
  Wrench,
  Star,
  BookOpen,
  PlayCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Industry {
  id: string;
  name: string;
  nameHindi: string;
  icon: any;
  description: string;
  vocabularyCount: number;
  scenarioCount: number;
  progress: number;
}

interface VocabularyItem {
  id: string;
  hindi: string;
  english: string;
  pronunciation?: string;
  example: string;
  category: 'Basic' | 'Intermediate' | 'Advanced';
}

interface Scenario {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

export default function IndustryModules() {
  const { toast } = useToast();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<'vocabulary' | 'scenarios'>('vocabulary');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const industries: Industry[] = [
    {
      id: 'retail',
      name: 'Retail',
      nameHindi: 'खुदरा व्यापार',
      icon: ShoppingCart,
      description: 'Shopping, sales, customer service',
      vocabularyCount: 150,
      scenarioCount: 25,
      progress: 35
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      nameHindi: 'विनिर्माण',
      icon: Building2,
      description: 'Production, quality, supply chain',
      vocabularyCount: 80,
      scenarioCount: 30,
      progress: 20
    },
    {
      id: 'services',
      name: 'Services',
      nameHindi: 'सेवाएं',
      icon: Wrench,
      description: 'Consulting, maintenance, support',
      vocabularyCount: 100,
      scenarioCount: 20,
      progress: 50
    },
    {
      id: 'hospitality',
      name: 'Hospitality',
      nameHindi: 'आतिथ्य',
      icon: Utensils,
      description: 'Hotels, restaurants, events',
      vocabularyCount: 100,
      scenarioCount: 35,
      progress: 10
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      nameHindi: 'स्वास्थ्य सेवा',
      icon: Stethoscope,
      description: 'Medical, pharmacy, wellness',
      vocabularyCount: 100,
      scenarioCount: 40,
      progress: 5
    },
    {
      id: 'logistics',
      name: 'Logistics',
      nameHindi: 'रसद',
      icon: Truck,
      description: 'Shipping, delivery, warehouse',
      vocabularyCount: 100,
      scenarioCount: 22,
      progress: 65
    }
  ];

  const vocabularyData: Record<string, VocabularyItem[]> = {
    retail: [
      { id: '1', hindi: 'ग्राहक', english: 'Customer', example: 'The customer is always right.', category: 'Basic' },
      { id: '2', hindi: 'खरीदार', english: 'Buyer', example: 'The buyer wants to see more options.', category: 'Basic' },
      { id: '3', hindi: 'विक्रेता', english: 'Seller', example: 'The seller explained the product features.', category: 'Basic' },
      { id: '4', hindi: 'दुकानदार', english: 'Shopkeeper', example: 'The shopkeeper opened the store early.', category: 'Basic' },
      { id: '5', hindi: 'सेवा', english: 'Service', example: 'We provide excellent customer service.', category: 'Basic' },
      { id: '6', hindi: 'सहायता', english: 'Assistance', example: 'Can I get some assistance please?', category: 'Basic' },
      { id: '7', hindi: 'स्वागत', english: 'Welcome', example: 'Welcome to our store!', category: 'Basic' },
      { id: '8', hindi: 'धन्यवाद', english: 'Thank you', example: 'Thank you for shopping with us.', category: 'Basic' },
      { id: '9', hindi: 'कृपया', english: 'Please', example: 'Please wait for a moment.', category: 'Basic' },
      { id: '10', hindi: 'माफ़ करें', english: 'Excuse me', example: 'Excuse me, where is the billing counter?', category: 'Basic' },
      { id: '11', hindi: 'जानकारी', english: 'Information', example: 'I need more information about this product.', category: 'Basic' },
      { id: '12', hindi: 'सलाह', english: 'Advice', example: 'My advice is to buy the premium quality.', category: 'Basic' },
      { id: '13', hindi: 'सुझाव', english: 'Suggestion', example: 'Do you have any suggestion for me?', category: 'Basic' },
      { id: '14', hindi: 'शिकायत', english: 'Complaint', example: 'I want to file a complaint.', category: 'Basic' },
      { id: '15', hindi: 'समस्या', english: 'Problem', example: 'What is the problem with this item?', category: 'Basic' },
      { id: '16', hindi: 'समाधान', english: 'Solution', example: 'We found a solution to your issue.', category: 'Basic' },
      { id: '17', hindi: 'संतुष्टि', english: 'Satisfaction', example: 'Customer satisfaction is our priority.', category: 'Basic' },
      { id: '18', hindi: 'गुणवत्ता', english: 'Quality', example: 'This product has excellent quality.', category: 'Basic' },
      { id: '19', hindi: 'मानक', english: 'Standard', example: 'We maintain high standards.', category: 'Basic' },
      { id: '20', hindi: 'अनुभव', english: 'Experience', example: 'Your shopping experience matters to us.', category: 'Basic' },
      { id: '21', hindi: 'उत्पाद', english: 'Product', example: 'This product is very popular.', category: 'Basic' },
      { id: '22', hindi: 'वस्तु', english: 'Item', example: 'Each item has a unique code.', category: 'Basic' },
      { id: '23', hindi: 'सामान', english: 'Goods', example: 'We sell quality goods.', category: 'Basic' },
      { id: '24', hindi: 'माल', english: 'Merchandise', example: 'Our merchandise is imported.', category: 'Basic' },
      { id: '25', hindi: 'स्टॉक', english: 'Stock', example: 'The stock is running low.', category: 'Basic' },
      { id: '26', hindi: 'इन्वेंट्री', english: 'Inventory', example: 'Check the inventory levels.', category: 'Basic' },
      { id: '27', hindi: 'भंडार', english: 'Storage', example: 'We need more storage space.', category: 'Basic' },
      { id: '28', hindi: 'गोदाम', english: 'Warehouse', example: 'The warehouse is fully stocked.', category: 'Basic' },
      { id: '29', hindi: 'आपूर्ति', english: 'Supply', example: 'Supply will arrive tomorrow.', category: 'Basic' },
      { id: '30', hindi: 'मांग', english: 'Demand', example: 'There is high demand for this.', category: 'Basic' },
      { id: '31', hindi: 'उपलब्धता', english: 'Availability', example: 'Check the availability first.', category: 'Basic' },
      { id: '32', hindi: 'कमी', english: 'Shortage', example: 'There is a shortage of this item.', category: 'Basic' },
      { id: '33', hindi: 'अधिकता', english: 'Surplus', example: 'We have surplus stock.', category: 'Basic' },
      { id: '34', hindi: 'नया', english: 'New', example: 'This is a new arrival.', category: 'Basic' },
      { id: '35', hindi: 'पुराना', english: 'Old', example: 'The old stock is on clearance.', category: 'Basic' },
      { id: '36', hindi: 'ताज़ा', english: 'Fresh', example: 'We have fresh vegetables.', category: 'Basic' },
      { id: '37', hindi: 'बासी', english: 'Stale', example: 'This bread is stale.', category: 'Basic' },
      { id: '38', hindi: 'दोषपूर्ण', english: 'Defective', example: 'The product is defective.', category: 'Basic' },
      { id: '39', hindi: 'क्षतिग्रस्त', english: 'Damaged', example: 'The box is damaged.', category: 'Basic' },
      { id: '40', hindi: 'वारंटी', english: 'Warranty', example: 'This comes with warranty.', category: 'Basic' },
      { id: '41', hindi: 'गारंटी', english: 'Guarantee', example: 'We guarantee the quality.', category: 'Basic' },
      { id: '42', hindi: 'ब्रांड', english: 'Brand', example: 'This is a popular brand.', category: 'Basic' },
      { id: '43', hindi: 'मॉडल', english: 'Model', example: 'Which model do you prefer?', category: 'Basic' },
      { id: '44', hindi: 'आकार', english: 'Size', example: 'What size do you need?', category: 'Basic' },
      { id: '45', hindi: 'रंग', english: 'Color', example: 'Choose your favorite color.', category: 'Basic' },
      { id: '46', hindi: 'बिक्री', english: 'Sales', example: 'Our sales increased this month.', category: 'Intermediate' },
      { id: '47', hindi: 'खरीदारी', english: 'Purchase', example: 'Complete your purchase today.', category: 'Intermediate' },
      { id: '48', hindi: 'लेन-देन', english: 'Transaction', example: 'The transaction is successful.', category: 'Intermediate' },
      { id: '49', hindi: 'बेचना', english: 'To sell', example: 'We sell at wholesale prices.', category: 'Intermediate' },
      { id: '50', hindi: 'खरीदना', english: 'To buy', example: 'I want to buy this item.', category: 'Intermediate' },
      { id: '51', hindi: 'ऑर्डर', english: 'Order', example: 'Place your order now.', category: 'Intermediate' },
      { id: '52', hindi: 'आदेश', english: 'Command', example: 'Follow the command carefully.', category: 'Intermediate' },
      { id: '53', hindi: 'बुकिंग', english: 'Booking', example: 'Your booking is confirmed.', category: 'Intermediate' },
      { id: '54', hindi: 'आरक्षण', english: 'Reservation', example: 'Make a reservation for tomorrow.', category: 'Intermediate' },
      { id: '55', hindi: 'डिलीवरी', english: 'Delivery', example: 'Free delivery within the city.', category: 'Intermediate' },
      { id: '56', hindi: 'शिपमेंट', english: 'Shipment', example: 'The shipment will arrive soon.', category: 'Intermediate' },
      { id: '57', hindi: 'पैकेजिंग', english: 'Packaging', example: 'Check the packaging quality.', category: 'Intermediate' },
      { id: '58', hindi: 'रैपिंग', english: 'Wrapping', example: 'Gift wrapping is available.', category: 'Intermediate' },
      { id: '59', hindi: 'बिल', english: 'Bill', example: 'Here is your bill.', category: 'Intermediate' },
      { id: '60', hindi: 'चालान', english: 'Invoice', example: 'Send the invoice by email.', category: 'Intermediate' },
      { id: '61', hindi: 'रसीद', english: 'Receipt', example: 'Keep your receipt safe.', category: 'Intermediate' },
      { id: '62', hindi: 'पर्ची', english: 'Slip', example: 'Fill this payment slip.', category: 'Intermediate' },
      { id: '63', hindi: 'वाउचर', english: 'Voucher', example: 'Use this discount voucher.', category: 'Intermediate' },
      { id: '64', hindi: 'कूपन', english: 'Coupon', example: 'Apply the coupon code.', category: 'Intermediate' },
      { id: '65', hindi: 'रिफंड', english: 'Refund', example: 'Processing your refund request.', category: 'Intermediate' },
      { id: '66', hindi: 'वापसी', english: 'Return', example: 'You can return within 30 days.', category: 'Intermediate' },
      { id: '67', hindi: 'एक्सचेंज', english: 'Exchange', example: 'Exchange is possible with receipt.', category: 'Intermediate' },
      { id: '68', hindi: 'बदलना', english: 'Replace', example: 'We can replace the defective item.', category: 'Intermediate' },
      { id: '69', hindi: 'रद्द', english: 'Cancel', example: 'Cancel the order if needed.', category: 'Intermediate' },
      { id: '70', hindi: 'पुष्टि', english: 'Confirm', example: 'Please confirm your address.', category: 'Intermediate' },
      { id: '71', hindi: 'कमीशन', english: 'Commission', example: 'The sales commission is 5%.', category: 'Intermediate' },
      { id: '72', hindi: 'कर', english: 'Tax', example: 'Include all taxes.', category: 'Intermediate' },
      { id: '73', hindi: 'जीएसटी', english: 'GST', example: 'GST is applicable.', category: 'Intermediate' },
      { id: '74', hindi: 'लाभ', english: 'Profit', example: 'Our profit margin is good.', category: 'Intermediate' },
      { id: '75', hindi: 'हानि', english: 'Loss', example: 'Avoid any loss in business.', category: 'Intermediate' },
      { id: '76', hindi: 'मार्जिन', english: 'Margin', example: 'Check the profit margin.', category: 'Intermediate' },
      { id: '77', hindi: 'ऑफर', english: 'Offer', example: 'This is a special offer.', category: 'Intermediate' },
      { id: '78', hindi: 'सौदा', english: 'Deal', example: 'Let\'s make a deal.', category: 'Intermediate' },
      { id: '79', hindi: 'बार्गेन', english: 'Bargain', example: 'This is a good bargain.', category: 'Intermediate' },
      { id: '80', hindi: 'मोल-भाव', english: 'Negotiation', example: 'Negotiation is possible.', category: 'Intermediate' },
      { id: '81', hindi: 'अग्रिम', english: 'Advance', example: 'Pay 50% advance.', category: 'Intermediate' },
      { id: '82', hindi: 'बकाया', english: 'Outstanding', example: 'Clear all outstanding dues.', category: 'Intermediate' },
      { id: '83', hindi: 'भुगतान', english: 'Payment', example: 'Payment is due tomorrow.', category: 'Intermediate' },
      { id: '84', hindi: 'जमा', english: 'Deposit', example: 'Make a deposit first.', category: 'Intermediate' },
      { id: '85', hindi: 'शेष', english: 'Balance', example: 'Check your account balance.', category: 'Intermediate' },
      { id: '86', hindi: 'दुकान', english: 'Shop', example: 'Our shop is open daily.', category: 'Intermediate' },
      { id: '87', hindi: 'स्टोर', english: 'Store', example: 'The store has three floors.', category: 'Intermediate' },
      { id: '88', hindi: 'शोरूम', english: 'Showroom', example: 'Visit our new showroom.', category: 'Intermediate' },
      { id: '89', hindi: 'काउंटर', english: 'Counter', example: 'Go to the billing counter.', category: 'Intermediate' },
      { id: '90', hindi: 'कैशियर', english: 'Cashier', example: 'The cashier will help you.', category: 'Intermediate' },
      { id: '91', hindi: 'रजिस्टर', english: 'Register', example: 'Use the cash register.', category: 'Intermediate' },
      { id: '92', hindi: 'पीओएस', english: 'POS', example: 'Our POS system is updated.', category: 'Advanced' },
      { id: '93', hindi: 'बारकोड', english: 'Barcode', example: 'Scan the barcode.', category: 'Advanced' },
      { id: '94', hindi: 'स्कैनर', english: 'Scanner', example: 'Use the barcode scanner.', category: 'Advanced' },
      { id: '95', hindi: 'शेल्फ', english: 'Shelf', example: 'Keep items on the shelf.', category: 'Intermediate' },
      { id: '96', hindi: 'डिस्प्ले', english: 'Display', example: 'Check the window display.', category: 'Intermediate' },
      { id: '97', hindi: 'विंडो', english: 'Window', example: 'New window design looks good.', category: 'Intermediate' },
      { id: '98', hindi: 'साइनबोर्ड', english: 'Signboard', example: 'Read the signboard carefully.', category: 'Intermediate' },
      { id: '99', hindi: 'बैनर', english: 'Banner', example: 'Put up the promotional banner.', category: 'Intermediate' },
      { id: '100', hindi: 'पोस्टर', english: 'Poster', example: 'This poster attracts customers.', category: 'Intermediate' },
      { id: '101', hindi: 'विज्ञापन', english: 'Advertisement', example: 'Our advertisement is effective.', category: 'Advanced' },
      { id: '102', hindi: 'प्रचार', english: 'Promotion', example: 'Promotion starts tomorrow.', category: 'Advanced' },
      { id: '103', hindi: 'मार्केटिंग', english: 'Marketing', example: 'Marketing strategy is working.', category: 'Advanced' },
      { id: '104', hindi: 'बिक्री', english: 'Sale', example: 'Sale ends this weekend.', category: 'Intermediate' },
      { id: '105', hindi: 'खुला', english: 'Open', example: 'The store is open now.', category: 'Basic' },
      { id: '106', hindi: 'नियमित', english: 'Regular', example: 'You are a regular customer.', category: 'Advanced' },
      { id: '107', hindi: 'वफादार', english: 'Loyal', example: 'Thank you for being loyal.', category: 'Advanced' },
      { id: '108', hindi: 'सदस्य', english: 'Member', example: 'Become a club member.', category: 'Advanced' },
      { id: '109', hindi: 'कार्ड', english: 'Card', example: 'Use your membership card.', category: 'Advanced' },
      { id: '110', hindi: 'पॉइंट्स', english: 'Points', example: 'Collect loyalty points.', category: 'Advanced' },
      { id: '111', hindi: 'रिवार्ड', english: 'Reward', example: 'Claim your reward points.', category: 'Advanced' },
      { id: '112', hindi: 'फीडबैक', english: 'Feedback', example: 'Give us your feedback.', category: 'Advanced' },
      { id: '113', hindi: 'रेटिंग', english: 'Rating', example: 'Rate our service.', category: 'Advanced' },
      { id: '114', hindi: 'रिव्यू', english: 'Review', example: 'Write a review online.', category: 'Advanced' },
      { id: '115', hindi: 'सिफारिश', english: 'Recommendation', example: 'Here is my recommendation.', category: 'Advanced' },
      { id: '116', hindi: 'संदर्भ', english: 'Reference', example: 'Use this as reference.', category: 'Advanced' },
      { id: '117', hindi: 'रेफरल', english: 'Referral', example: 'Get referral bonus.', category: 'Advanced' },
      { id: '118', hindi: 'वीआईपी', english: 'VIP', example: 'You are our VIP customer.', category: 'Advanced' },
      { id: '119', hindi: 'प्रीमियम', english: 'Premium', example: 'Premium members get discounts.', category: 'Advanced' },
      { id: '120', hindi: 'बेसिक', english: 'Basic', example: 'This is our basic plan.', category: 'Advanced' },
      { id: '121', hindi: 'लक्ष्य', english: 'Target', example: 'Set a monthly sales target.', category: 'Advanced' },
      { id: '122', hindi: 'उद्देश्य', english: 'Objective', example: 'Our main objective is growth.', category: 'Advanced' },
      { id: '123', hindi: 'रणनीति', english: 'Strategy', example: 'Plan your marketing strategy.', category: 'Advanced' },
      { id: '124', hindi: 'योजना', english: 'Plan', example: 'Make a business plan.', category: 'Advanced' },
      { id: '125', hindi: 'बजट', english: 'Budget', example: 'Prepare the monthly budget.', category: 'Advanced' },
      { id: '126', hindi: 'खर्च', english: 'Expense', example: 'Control your daily expenses.', category: 'Advanced' },
      { id: '127', hindi: 'आमदनी', english: 'Income', example: 'Track your monthly income.', category: 'Advanced' },
      { id: '128', hindi: 'नुकसान', english: 'Damage', example: 'Avoid any property damage.', category: 'Advanced' },
      { id: '129', hindi: 'बीमा', english: 'Insurance', example: 'Get business insurance.', category: 'Advanced' },
      { id: '130', hindi: 'लाइसेंस', english: 'License', example: 'Renew your trade license.', category: 'Advanced' },
      { id: '131', hindi: 'ऑनलाइन', english: 'Online', example: 'Shop online from home.', category: 'Advanced' },
      { id: '132', hindi: 'वेबसाइट', english: 'Website', example: 'Visit our website.', category: 'Advanced' },
      { id: '133', hindi: 'ऐप', english: 'App', example: 'Download our mobile app.', category: 'Advanced' },
      { id: '134', hindi: 'डिजिटल', english: 'Digital', example: 'Use digital payment methods.', category: 'Advanced' },
      { id: '135', hindi: 'ई-कॉमर्स', english: 'E-commerce', example: 'We sell on e-commerce platforms.', category: 'Advanced' },
      { id: '136', hindi: 'सोशल मीडिया', english: 'Social Media', example: 'Follow us on social media.', category: 'Advanced' },
      { id: '137', hindi: 'ऑटोमेशन', english: 'Automation', example: 'Automation saves time.', category: 'Advanced' },
      { id: '138', hindi: 'डेटा', english: 'Data', example: 'Analyze customer data.', category: 'Advanced' },
      { id: '139', hindi: 'एनालिटिक्स', english: 'Analytics', example: 'Check the sales analytics.', category: 'Advanced' },
      { id: '140', hindi: 'रिपोर्ट', english: 'Report', example: 'Generate monthly reports.', category: 'Advanced' }
    ],
    manufacturing: [
      { id: "1", hindi: "उत्पादन", english: "Production", example: "Production will start next week.", category: "Basic" },
      { id: "2", hindi: "गुणवत्ता", english: "Quality", example: "We maintain high quality standards.", category: "Basic" },
      { id: "3", hindi: "मशीन", english: "Machine", example: "The machine needs maintenance.", category: "Basic" },
      { id: "4", hindi: "कच्चा माल", english: "Raw Materials", example: "We need more raw materials.", category: "Basic" },
      { id: "5", hindi: "प्रक्रिया", english: "Process", example: "The process is automated.", category: "Basic" },
      { id: "6", hindi: "आउटपुट", english: "Output", example: "The output meets expectations.", category: "Basic" },
      { id: "7", hindi: "दक्षता", english: "Efficiency", example: "Efficiency has increased this year.", category: "Basic" },
      { id: "8", hindi: "नुकसान", english: "Loss", example: "There was a loss due to defects.", category: "Basic" },
      { id: "9", hindi: "डिज़ाइन", english: "Design", example: "The design is approved.", category: "Basic" },
      { id: "10", hindi: "स्वीकृति", english: "Approval", example: "Approval is required for changes.", category: "Basic" },
      { id: "11", hindi: "माप", english: "Measurement", example: "Take the measurement carefully.", category: "Basic" },
      { id: "12", hindi: "उपकरण", english: "Equipment", example: "All equipment is tested.", category: "Basic" },
      { id: "13", hindi: "गति", english: "Speed", example: "Increase the machine speed.", category: "Basic" },
      { id: "14", hindi: "स्पेयर पार्ट्स", english: "Spare Parts", example: "Keep spare parts ready.", category: "Basic" },
      { id: "15", hindi: "श्रमिक", english: "Worker", example: "Each worker has safety gear.", category: "Basic" },
      { id: "16", hindi: "रखरखाव", english: "Maintenance", example: "Regular maintenance prevents breakdowns.", category: "Basic" },
      { id: "17", hindi: "टेस्टिंग", english: "Testing", example: "Product testing is important.", category: "Basic" },
      { id: "18", hindi: "डिलीवरी", english: "Delivery", example: "Delivery is scheduled for Friday.", category: "Basic" },
      { id: "19", hindi: "स्वचालन", english: "Automation", example: "Automation saves time.", category: "Basic" },
      { id: "20", hindi: "ऑर्डर", english: "Order", example: "Place the order now.", category: "Basic" },
      { id: "21", hindi: "सुरक्षा", english: "Safety", example: "Safety is our top priority.", category: "Basic" },
      { id: "22", hindi: "शिफ्ट", english: "Shift", example: "The morning shift starts at 8 a.m.", category: "Basic" },
      { id: "23", hindi: "संपूर्ण", english: "Complete", example: "The task is complete.", category: "Basic" },
      { id: "24", hindi: "कीमत", english: "Price", example: "The price of copper increased.", category: "Basic" },
      { id: "25", hindi: "विकास", english: "Development", example: "Development is ongoing.", category: "Intermediate" },
      { id: "26", hindi: "तकनीक", english: "Technology", example: "New technology is implemented.", category: "Intermediate" },
      { id: "27", hindi: "मैनेजर", english: "Manager", example: "Speak to the line manager.", category: "Intermediate" },
      { id: "28", hindi: "समय सीमा", english: "Deadline", example: "Meet the project deadline.", category: "Intermediate" },
      { id: "29", hindi: "गुणवत्ता नियंत्रण", english: "Quality Control", example: "Quality control is strict.", category: "Intermediate" },
      { id: "30", hindi: "लाभ", english: "Profit", example: "Profit increased this quarter.", category: "Intermediate" },
      { id: "31", hindi: "उत्पादन दर", english: "Production Rate", example: "Check the production rate daily.", category: "Intermediate" },
      { id: "32", hindi: "ऊर्जा", english: "Energy", example: "Save energy in production.", category: "Intermediate" },
      { id: "33", hindi: "कर्मचारी", english: "Employee", example: "Every employee gets benefits.", category: "Intermediate" },
      { id: "34", hindi: "सिस्टम", english: "System", example: "The new system is efficient.", category: "Intermediate" },
      { id: "35", hindi: "आयात", english: "Import", example: "Import duties are high.", category: "Intermediate" },
      { id: "36", hindi: "निर्यात", english: "Export", example: "Export orders are increasing.", category: "Intermediate" },
      { id: "37", hindi: "लक्ष्य", english: "Target", example: "We achieved our monthly target.", category: "Intermediate" },
      { id: "38", hindi: "नेटवर्क", english: "Network", example: "The supply network is strong.", category: "Intermediate" },
      { id: "39", hindi: "ब्रांड", english: "Brand", example: "Our brand is trusted worldwide.", category: "Intermediate" },
      { id: "40", hindi: "कस्टमर", english: "Customer", example: "Customer satisfaction is important.", category: "Intermediate" },
      { id: "41", hindi: "वेंडर", english: "Vendor", example: "Choose a reliable vendor.", category: "Intermediate" },
      { id: "42", hindi: "चैनल", english: "Channel", example: "Distribution channels are ready.", category: "Intermediate" },
      { id: "43", hindi: "मार्केट", english: "Market", example: "Market demand is high.", category: "Intermediate" },
      { id: "44", hindi: "कैपेसिटी", english: "Capacity", example: "Factory capacity is increasing.", category: "Intermediate" },
      { id: "45", hindi: "ऑपरेशन", english: "Operation", example: "Operation started smoothly.", category: "Intermediate" },
      { id: "46", hindi: "प्लान", english: "Plan", example: "The production plan is ready.", category: "Intermediate" },
      { id: "47", hindi: "स्ट्रैटेजी", english: "Strategy", example: "Our strategy is working.", category: "Intermediate" },
      { id: "48", hindi: "ट्रेनिंग", english: "Training", example: "Employee training is mandatory.", category: "Intermediate" },
      { id: "49", hindi: "स्किल", english: "Skill", example: "Technical skills are needed.", category: "Intermediate" },
      { id: "50", hindi: "मॉडल", english: "Model", example: "This is our latest model.", category: "Intermediate" },
      { id: "51", hindi: "ऑप्टिमाइज़ेशन", english: "Optimization", example: "Process optimization is key to efficiency.", category: "Advanced" },
      { id: "52", hindi: "बेंचमार्क", english: "Benchmark", example: "Set a benchmark for quality standards.", category: "Advanced" },
      { id: "53", hindi: "लीन मैन्युफैक्चरिंग", english: "Lean Manufacturing", example: "Lean manufacturing reduces waste significantly.", category: "Advanced" },
      { id: "54", hindi: "सिक्स सिग्मा", english: "Six Sigma", example: "Six Sigma methodology improves quality control.", category: "Advanced" },
      { id: "55", hindi: "आपूर्ति श्रृंखला", english: "Supply Chain", example: "Supply chain disruptions affect production.", category: "Advanced" },
      { id: "56", hindi: "ऑटोमेशन", english: "Automation", example: "Industrial automation is the future.", category: "Advanced" },
      { id: "57", hindi: "रोबोटिक्स", english: "Robotics", example: "Robotics increases precision in manufacturing.", category: "Advanced" },
      { id: "58", hindi: "कृत्रिम बुद्धिमत्ता", english: "Artificial Intelligence", example: "AI helps in predictive maintenance.", category: "Advanced" },
      { id: "59", hindi: "डिजिटल ट्रांसफॉर्मेशन", english: "Digital Transformation", example: "Digital transformation modernizes operations.", category: "Advanced" },
      { id: "60", hindi: "इंडस्ट्री 4.0", english: "Industry 4.0", example: "Industry 4.0 revolutionizes manufacturing.", category: "Advanced" },
      { id: "61", hindi: "IoT", english: "Internet of Things", example: "IoT sensors monitor machine performance.", category: "Advanced" },
      { id: "62", hindi: "बिग डेटा", english: "Big Data", example: "Big data analytics improves decision making.", category: "Advanced" },
      { id: "63", hindi: "प्रीडिक्टिव एनालिटिक्स", english: "Predictive Analytics", example: "Predictive analytics prevents equipment failure.", category: "Advanced" },
      { id: "64", hindi: "क्वालिटी असुरांस", english: "Quality Assurance", example: "Quality assurance ensures product standards.", category: "Advanced" },
      { id: "65", hindi: "टोटल क्वालिटी मैनेजमेंट", english: "Total Quality Management", example: "TQM involves all employees in quality improvement.", category: "Advanced" },
      { id: "66", hindi: "जस्ट-इन-टाइम", english: "Just-in-Time", example: "Just-in-time production minimizes inventory costs.", category: "Advanced" },
      { id: "67", hindi: "कैपेसिटी प्लानिंग", english: "Capacity Planning", example: "Capacity planning optimizes resource utilization.", category: "Advanced" },
      { id: "68", hindi: "रिसोर्स मैनेजमेंट", english: "Resource Management", example: "Effective resource management reduces costs.", category: "Advanced" },
      { id: "69", hindi: "सस्टेनेबिलिटी", english: "Sustainability", example: "Sustainability is crucial for future growth.", category: "Advanced" },
      { id: "70", hindi: "कार्बन फुटप्रिंट", english: "Carbon Footprint", example: "Reducing carbon footprint is our priority.", category: "Advanced" },
      { id: "71", hindi: "ग्रीन मैन्युफैक्चरिंग", english: "Green Manufacturing", example: "Green manufacturing protects the environment.", category: "Advanced" },
      { id: "72", hindi: "एनर्जी एफिशिएंसी", english: "Energy Efficiency", example: "Energy efficiency reduces operational costs.", category: "Advanced" },
      { id: "73", hindi: "वेस्ट रिडक्शन", english: "Waste Reduction", example: "Waste reduction improves profitability.", category: "Advanced" },
      { id: "74", hindi: "रीसाइक्लिंग", english: "Recycling", example: "Recycling materials saves resources.", category: "Advanced" },
      { id: "75", hindi: "सर्कुलर इकॉनमी", english: "Circular Economy", example: "Circular economy promotes resource reuse.", category: "Advanced" },
      { id: "76", hindi: "कंप्लायंस", english: "Compliance", example: "Regulatory compliance is mandatory.", category: "Advanced" },
      { id: "77", hindi: "रेगुलेटरी अफेयर्स", english: "Regulatory Affairs", example: "Regulatory affairs ensure legal compliance.", category: "Advanced" },
      { id: "78", hindi: "सर्टिफिकेशन", english: "Certification", example: "ISO certification validates quality systems.", category: "Advanced" },
      { id: "79", hindi: "ऑडिट", english: "Audit", example: "Regular audits ensure compliance.", category: "Advanced" },
      { id: "80", hindi: "रिस्क मैनेजमेंट", english: "Risk Management", example: "Risk management prevents operational failures.", category: "Advanced" }
    ],
    services: [
      // Basic Category (30 words)
      { id: '1', hindi: 'ग्राहक', english: 'Customer', example: 'The customer asked for assistance.', category: 'Basic' },
      { id: '2', hindi: 'सेवा', english: 'Service', example: 'We provide fast and reliable service.', category: 'Basic' },
      { id: '3', hindi: 'कर्मचारी', english: 'Employee', example: 'The employee greeted the guest.', category: 'Basic' },
      { id: '4', hindi: 'सहायता', english: 'Assistance', example: 'We offer assistance to all visitors.', category: 'Basic' },
      { id: '5', hindi: 'प्रबंधक', english: 'Manager', example: 'The manager resolved the issue.', category: 'Basic' },
      { id: '6', hindi: 'आरक्षण', english: 'Reservation', example: 'I made a reservation at the hotel.', category: 'Basic' },
      { id: '7', hindi: 'अतिथि', english: 'Guest', example: 'The guest checked in at the reception.', category: 'Basic' },
      { id: '8', hindi: 'सुविधा', english: 'Facility', example: 'The facility is open 24/7.', category: 'Basic' },
      { id: '9', hindi: 'भुगतान', english: 'Payment', example: 'The payment was processed online.', category: 'Basic' },
      { id: '10', hindi: 'रसीद', english: 'Receipt', example: 'Please keep the receipt for reference.', category: 'Basic' },
      { id: '11', hindi: 'संतुष्टि', english: 'Satisfaction', example: 'Customer satisfaction is our priority.', category: 'Basic' },
      { id: '12', hindi: 'शिकायत', english: 'Complaint', example: 'The complaint was resolved quickly.', category: 'Basic' },
      { id: '13', hindi: 'संपर्क', english: 'Contact', example: 'Please contact us for more details.', category: 'Basic' },
      { id: '14', hindi: 'नियुक्ति', english: 'Appointment', example: 'I booked an appointment with the doctor.', category: 'Basic' },
      { id: '15', hindi: 'पंक्ति', english: 'Queue', example: 'Customers waited in a queue.', category: 'Basic' },
      { id: '16', hindi: 'समय', english: 'Timing', example: 'The service timing is from 9 AM to 6 PM.', category: 'Basic' },
      { id: '17', hindi: 'ऑर्डर', english: 'Order', example: 'The order was delivered on time.', category: 'Basic' },
      { id: '18', hindi: 'बिल', english: 'Bill', example: 'The bill was paid in cash.', category: 'Basic' },
      { id: '19', hindi: 'सफाई', english: 'Cleaning', example: 'The cleaning service is excellent.', category: 'Basic' },
      { id: '20', hindi: 'मरम्मत', english: 'Repair', example: 'The repair service was quick.', category: 'Basic' },
      { id: '21', hindi: 'बुकिंग', english: 'Booking', example: 'The booking was confirmed instantly.', category: 'Basic' },
      { id: '22', hindi: 'डिलीवरी', english: 'Delivery', example: 'The delivery was delayed.', category: 'Basic' },
      { id: '23', hindi: 'रद्द', english: 'Cancel', example: 'The reservation was canceled.', category: 'Basic' },
      { id: '24', hindi: 'सुरक्षा', english: 'Security', example: 'The building has tight security.', category: 'Basic' },
      { id: '25', hindi: 'प्रतीक्षा', english: 'Waiting', example: 'There was a long waiting time.', category: 'Basic' },
      { id: '26', hindi: 'पंजीकरण', english: 'Registration', example: 'Online registration is required.', category: 'Basic' },
      { id: '27', hindi: 'हेल्पलाइन', english: 'Helpline', example: 'Call the helpline for support.', category: 'Basic' },
      { id: '28', hindi: 'छूट', english: 'Discount', example: 'We offer a discount on services.', category: 'Basic' },
      { id: '29', hindi: 'मूल्य', english: 'Price', example: 'The price is reasonable.', category: 'Basic' },
      { id: '30', hindi: 'गुणवत्ता', english: 'Quality', example: 'Quality service is guaranteed.', category: 'Basic' },
      
      // Intermediate Category (40 words)
      { id: '31', hindi: 'ग्राहक समर्थन', english: 'Customer Support', example: 'Customer support resolved the query.', category: 'Intermediate' },
      { id: '32', hindi: 'प्रतिक्रिया', english: 'Feedback', example: 'We value customer feedback.', category: 'Intermediate' },
      { id: '33', hindi: 'वितरण', english: 'Distribution', example: 'The distribution process was efficient.', category: 'Intermediate' },
      { id: '34', hindi: 'संविदा', english: 'Contract', example: 'The contract was signed yesterday.', category: 'Intermediate' },
      { id: '35', hindi: 'सदस्यता', english: 'Membership', example: 'The membership includes free services.', category: 'Intermediate' },
      { id: '36', hindi: 'प्रशिक्षण', english: 'Training', example: 'Employees received training.', category: 'Intermediate' },
      { id: '37', hindi: 'उन्नयन', english: 'Upgrade', example: 'The software upgrade was successful.', category: 'Intermediate' },
      { id: '38', hindi: 'अनुभव', english: 'Experience', example: 'The customer experience was positive.', category: 'Intermediate' },
      { id: '39', hindi: 'प्रोत्साहन', english: 'Incentive', example: 'Employees get incentives for good work.', category: 'Intermediate' },
      { id: '40', hindi: 'अनुवर्ती', english: 'Follow-up', example: 'A follow-up call was scheduled.', category: 'Intermediate' },
      { id: '41', hindi: 'बीमा', english: 'Insurance', example: 'The service includes insurance.', category: 'Intermediate' },
      { id: '42', hindi: 'सद्भावना', english: 'Goodwill', example: 'The company has built goodwill.', category: 'Intermediate' },
      { id: '43', hindi: 'पुष्टिकरण', english: 'Confirmation', example: 'We sent a booking confirmation email.', category: 'Intermediate' },
      { id: '44', hindi: 'लॉजिस्टिक्स', english: 'Logistics', example: 'Logistics support is provided.', category: 'Intermediate' },
      { id: '45', hindi: 'विस्तार', english: 'Expansion', example: 'The company plans service expansion.', category: 'Intermediate' },
      { id: '46', hindi: 'रणनीति', english: 'Strategy', example: 'A customer service strategy is required.', category: 'Intermediate' },
      { id: '47', hindi: 'नवाचार', english: 'Innovation', example: 'Innovation drives better services.', category: 'Intermediate' },
      { id: '48', hindi: 'विशेषज्ञ', english: 'Specialist', example: 'The specialist handled the case.', category: 'Intermediate' },
      { id: '49', hindi: 'पारदर्शिता', english: 'Transparency', example: 'Transparency builds customer trust.', category: 'Intermediate' },
      { id: '50', hindi: 'विश्वसनीयता', english: 'Reliability', example: 'Reliability is our strength.', category: 'Intermediate' },
      { id: '51', hindi: 'समाधान', english: 'Solution', example: 'We offered a quick solution.', category: 'Intermediate' },
      { id: '52', hindi: 'विकल्प', english: 'Option', example: 'Customers were given multiple options.', category: 'Intermediate' },
      { id: '53', hindi: 'अनुकूलन', english: 'Customization', example: 'The service allows customization.', category: 'Intermediate' },
      { id: '54', hindi: 'निष्ठा', english: 'Loyalty', example: 'We reward customer loyalty.', category: 'Intermediate' },
      { id: '55', hindi: 'प्रक्रिया प्रवाह', english: 'Workflow', example: 'The workflow was automated.', category: 'Intermediate' },
      { id: '56', hindi: 'निगरानी', english: 'Monitoring', example: 'The monitoring team checked the system.', category: 'Intermediate' },
      { id: '57', hindi: 'मूल्यांकन', english: 'Evaluation', example: 'The service evaluation was positive.', category: 'Intermediate' },
      { id: '58', hindi: 'सुझाव', english: 'Suggestion', example: 'We accepted the customer\'s suggestion.', category: 'Intermediate' },
      { id: '59', hindi: 'निरंतरता', english: 'Continuity', example: 'Service continuity was maintained.', category: 'Intermediate' },
      { id: '60', hindi: 'उत्पादकता', english: 'Productivity', example: 'Training improved productivity.', category: 'Intermediate' },
      { id: '61', hindi: 'समन्वय', english: 'Coordination', example: 'Coordination between teams was smooth.', category: 'Intermediate' },
      { id: '62', hindi: 'क्षमता', english: 'Efficiency', example: 'The system improved efficiency.', category: 'Intermediate' },
      { id: '63', hindi: 'उपलब्धता', english: 'Availability', example: '24/7 availability is ensured.', category: 'Intermediate' },
      { id: '64', hindi: 'समीक्षा', english: 'Review', example: 'The customer wrote a positive review.', category: 'Intermediate' },
      { id: '65', hindi: 'प्रभावशीलता', english: 'Effectiveness', example: 'The effectiveness was tested.', category: 'Intermediate' },
      { id: '66', hindi: 'रखरखाव', english: 'Maintenance', example: 'System maintenance is scheduled.', category: 'Intermediate' },
      { id: '67', hindi: 'परामर्श', english: 'Consultation', example: 'The doctor provided a consultation.', category: 'Intermediate' },
      { id: '68', hindi: 'समर्थन प्रणाली', english: 'Support System', example: 'The support system was upgraded.', category: 'Intermediate' },
      { id: '69', hindi: 'विकास', english: 'Development', example: 'The company focuses on employee development.', category: 'Intermediate' },
      { id: '70', hindi: 'नेटवर्किंग', english: 'Networking', example: 'Networking events help professionals.', category: 'Intermediate' },
      
      // Advanced Category (30 words)
      { id: '71', hindi: 'सेवा स्तर अनुबंध', english: 'Service Level Agreement', example: 'The SLA was signed with the client.', category: 'Advanced' },
      { id: '72', hindi: 'ग्राहक यात्रा', english: 'Customer Journey', example: 'We mapped the customer journey.', category: 'Advanced' },
      { id: '73', hindi: 'ग्राहक प्रतिधारण', english: 'Customer Retention', example: 'Retention strategies improved loyalty.', category: 'Advanced' },
      { id: '74', hindi: 'डिजिटल परिवर्तन', english: 'Digital Transformation', example: 'Digital transformation changed services.', category: 'Advanced' },
      { id: '75', hindi: 'आउटसोर्सिंग', english: 'Outsourcing', example: 'The company outsourced IT services.', category: 'Advanced' },
      { id: '76', hindi: 'सामरिक साझेदारी', english: 'Strategic Partnership', example: 'We signed a strategic partnership.', category: 'Advanced' },
      { id: '77', hindi: 'अनुपालन', english: 'Compliance', example: 'The company follows compliance rules.', category: 'Advanced' },
      { id: '78', hindi: 'डेटा सुरक्षा', english: 'Data Security', example: 'Data security is critical.', category: 'Advanced' },
      { id: '79', hindi: 'ग्राहक अंतर्दृष्टि', english: 'Customer Insights', example: 'Customer insights guide improvements.', category: 'Advanced' },
      { id: '80', hindi: 'नवाचार प्रबंधन', english: 'Innovation Management', example: 'Innovation management drives change.', category: 'Advanced' },
      { id: '81', hindi: 'स्वचालन', english: 'Automation', example: 'Automation reduced manual tasks.', category: 'Advanced' },
      { id: '82', hindi: 'डिजिटल प्लेटफॉर्म', english: 'Digital Platform', example: 'The digital platform is user-friendly.', category: 'Advanced' },
      { id: '83', hindi: 'ग्राहक अपेक्षाएँ', english: 'Customer Expectations', example: 'We aligned with customer expectations.', category: 'Advanced' },
      { id: '84', hindi: 'जोखिम प्रबंधन', english: 'Risk Management', example: 'Risk management ensures continuity.', category: 'Advanced' },
      { id: '85', hindi: 'परियोजना प्रबंधन', english: 'Project Management', example: 'The project management team delivered results.', category: 'Advanced' },
      { id: '86', hindi: 'व्यवसाय विश्लेषण', english: 'Business Analysis', example: 'Business analysis improved services.', category: 'Advanced' },
      { id: '87', hindi: 'प्रक्रिया सुधार', english: 'Process Improvement', example: 'Process improvement increased efficiency.', category: 'Advanced' },
      { id: '88', hindi: 'ग्राहक अनुभव प्रबंधन', english: 'Customer Experience Management', example: 'CEM enhanced satisfaction.', category: 'Advanced' },
      { id: '89', hindi: 'नवाचार रणनीति', english: 'Innovation Strategy', example: 'The innovation strategy was successful.', category: 'Advanced' },
      { id: '90', hindi: 'कर्मचारी संलग्नता', english: 'Employee Engagement', example: 'Employee engagement improved morale.', category: 'Advanced' },
      { id: '91', hindi: 'मानकीकरण', english: 'Standardization', example: 'Standardization improved quality.', category: 'Advanced' },
      { id: '92', hindi: 'डिजिटल मार्केटिंग', english: 'Digital Marketing', example: 'Digital marketing increased reach.', category: 'Advanced' },
      { id: '93', hindi: 'परिवर्तन प्रबंधन', english: 'Change Management', example: 'Change management ensured success.', category: 'Advanced' },
      { id: '94', hindi: 'ज्ञान प्रबंधन', english: 'Knowledge Management', example: 'Knowledge management improved efficiency.', category: 'Advanced' },
      { id: '95', hindi: 'स्वास्थ्य और सुरक्षा', english: 'Health and Safety', example: 'Health and safety are priorities.', category: 'Advanced' },
      { id: '96', hindi: 'सततता', english: 'Sustainability', example: 'Sustainability is part of our strategy.', category: 'Advanced' },
      { id: '97', hindi: 'कौशल विकास', english: 'Skill Development', example: 'Skill development helped employees.', category: 'Advanced' },
      { id: '98', hindi: 'प्रौद्योगिकी अपनाना', english: 'Technology Adoption', example: 'Technology adoption was smooth.', category: 'Advanced' },
      { id: '99', hindi: 'सेवा नवाचार', english: 'Service Innovation', example: 'Service innovation created value.', category: 'Advanced' },
      { id: '100', hindi: 'ग्राहक विभाजन', english: 'Customer Segmentation', example: 'Segmentation improved targeting.', category: 'Advanced' }
    ],
    hospitality: [
      // Basic Category (30 words)
      { id: '1', hindi: 'अतिथि', english: 'Guest', example: 'The guest arrived at the hotel.', category: 'Basic' },
      { id: '2', hindi: 'होटल', english: 'Hotel', example: 'The hotel is fully booked.', category: 'Basic' },
      { id: '3', hindi: 'कमरा', english: 'Room', example: 'The room is clean and ready.', category: 'Basic' },
      { id: '4', hindi: 'आरक्षण', english: 'Reservation', example: 'The reservation was confirmed.', category: 'Basic' },
      { id: '5', hindi: 'चेक-इन', english: 'Check-in', example: 'The check-in process was smooth.', category: 'Basic' },
      { id: '6', hindi: 'चेक-आउट', english: 'Check-out', example: 'The guest completed the check-out.', category: 'Basic' },
      { id: '7', hindi: 'सफाई', english: 'Housekeeping', example: 'Housekeeping cleaned the room.', category: 'Basic' },
      { id: '8', hindi: 'स्टाफ', english: 'Staff', example: 'The staff welcomed the visitors.', category: 'Basic' },
      { id: '9', hindi: 'भोजन', english: 'Meal', example: 'The meal was delicious.', category: 'Basic' },
      { id: '10', hindi: 'रेस्तरां', english: 'Restaurant', example: 'The restaurant serves breakfast.', category: 'Basic' },
      { id: '11', hindi: 'सेवा', english: 'Service', example: 'The service was excellent.', category: 'Basic' },
      { id: '12', hindi: 'मेनू', english: 'Menu', example: 'The menu includes vegetarian options.', category: 'Basic' },
      { id: '13', hindi: 'बिल', english: 'Bill', example: 'The bill was paid at the counter.', category: 'Basic' },
      { id: '14', hindi: 'भुगतान', english: 'Payment', example: 'Payment was made by card.', category: 'Basic' },
      { id: '15', hindi: 'कुंजी', english: 'Key', example: 'The receptionist gave the room key.', category: 'Basic' },
      { id: '16', hindi: 'स्वागत', english: 'Welcome', example: 'The welcome drink was refreshing.', category: 'Basic' },
      { id: '17', hindi: 'पूल', english: 'Pool', example: 'The hotel has a swimming pool.', category: 'Basic' },
      { id: '18', hindi: 'लॉबी', english: 'Lobby', example: 'The guests waited in the lobby.', category: 'Basic' },
      { id: '19', hindi: 'बार', english: 'Bar', example: 'The bar is open till midnight.', category: 'Basic' },
      { id: '20', hindi: 'स्पा', english: 'Spa', example: 'The spa offers relaxation therapy.', category: 'Basic' },
      { id: '21', hindi: 'रसोई', english: 'Kitchen', example: 'The kitchen prepares fresh food.', category: 'Basic' },
      { id: '22', hindi: 'टेबल', english: 'Table', example: 'The table was reserved for dinner.', category: 'Basic' },
      { id: '23', hindi: 'कुर्सी', english: 'Chair', example: 'The chair was comfortable.', category: 'Basic' },
      { id: '24', hindi: 'फोन', english: 'Phone', example: 'The guest used the phone in the room.', category: 'Basic' },
      { id: '25', hindi: 'सुरक्षा', english: 'Security', example: 'Security checked the visitors.', category: 'Basic' },
      { id: '26', hindi: 'स्वच्छता', english: 'Cleanliness', example: 'Cleanliness is maintained everywhere.', category: 'Basic' },
      { id: '27', hindi: 'वर्दी', english: 'Uniform', example: 'The staff wore a uniform.', category: 'Basic' },
      { id: '28', hindi: 'टिप', english: 'Tip', example: 'He left a tip for the waiter.', category: 'Basic' },
      { id: '29', hindi: 'डिलीवरी', english: 'Delivery', example: 'Room delivery was on time.', category: 'Basic' },
      { id: '30', hindi: 'शिकायत', english: 'Complaint', example: 'The complaint was resolved quickly.', category: 'Basic' },
      
      // Intermediate Category (40 words)
      { id: '31', hindi: 'कमरा सेवा', english: 'Room Service', example: 'Room service was quick.', category: 'Intermediate' },
      { id: '32', hindi: 'बुफे', english: 'Buffet', example: 'The buffet had many options.', category: 'Intermediate' },
      { id: '33', hindi: 'कंसीयर्ज', english: 'Concierge', example: 'The concierge helped book a taxi.', category: 'Intermediate' },
      { id: '34', hindi: 'पार्किंग', english: 'Parking', example: 'The hotel offers free parking.', category: 'Intermediate' },
      { id: '35', hindi: 'पुष्टिकरण', english: 'Confirmation', example: 'Guests received booking confirmation.', category: 'Intermediate' },
      { id: '36', hindi: 'भोजन सेवा', english: 'Catering', example: 'Catering was arranged for the event.', category: 'Intermediate' },
      { id: '37', hindi: 'आराम', english: 'Comfort', example: 'Comfort was a priority for the guests.', category: 'Intermediate' },
      { id: '38', hindi: 'इंटरनेट', english: 'Internet', example: 'Free internet is available in all rooms.', category: 'Intermediate' },
      { id: '39', hindi: 'वाई-फाई', english: 'Wi-Fi', example: 'The Wi-Fi password was provided.', category: 'Intermediate' },
      { id: '40', hindi: 'प्रशिक्षण', english: 'Training', example: 'The staff received service training.', category: 'Intermediate' },
      { id: '41', hindi: 'रसोइया', english: 'Chef', example: 'The chef prepared Italian food.', category: 'Intermediate' },
      { id: '42', hindi: 'पर्यटक', english: 'Tourist', example: 'Tourists stayed at the resort.', category: 'Intermediate' },
      { id: '43', hindi: 'सुविधाएं', english: 'Amenities', example: 'Amenities included a gym and pool.', category: 'Intermediate' },
      { id: '44', hindi: 'सम्मेलन कक्ष', english: 'Conference Room', example: 'The conference room was booked.', category: 'Intermediate' },
      { id: '45', hindi: 'शटल', english: 'Shuttle', example: 'The shuttle service dropped guests at the airport.', category: 'Intermediate' },
      { id: '46', hindi: 'विशेष अनुरोध', english: 'Special Request', example: 'The guest had a special request.', category: 'Intermediate' },
      { id: '47', hindi: 'क्लर्क', english: 'Clerk', example: 'The clerk checked the reservation.', category: 'Intermediate' },
      { id: '48', hindi: 'पंक्ति', english: 'Queue', example: 'Guests stood in a queue for check-in.', category: 'Intermediate' },
      { id: '49', hindi: 'समारोह', english: 'Event', example: 'The hotel hosted a wedding event.', category: 'Intermediate' },
      { id: '50', hindi: 'सदस्यता', english: 'Membership', example: 'Membership offers exclusive discounts.', category: 'Intermediate' },
      { id: '51', hindi: 'मूल्यांकन', english: 'Evaluation', example: 'Guest evaluation helps improve service.', category: 'Intermediate' },
      { id: '52', hindi: 'अनुभव', english: 'Experience', example: 'The experience was memorable.', category: 'Intermediate' },
      { id: '53', hindi: 'पारदर्शिता', english: 'Transparency', example: 'Transparency in billing is maintained.', category: 'Intermediate' },
      { id: '54', hindi: 'प्रचार', english: 'Promotion', example: 'Promotions attracted more guests.', category: 'Intermediate' },
      { id: '55', hindi: 'ग्राहक समर्थन', english: 'Customer Support', example: 'Customer support assisted with queries.', category: 'Intermediate' },
      { id: '56', hindi: 'पुनर्निर्माण', english: 'Renovation', example: 'The hotel is under renovation.', category: 'Intermediate' },
      { id: '57', hindi: 'रखरखाव', english: 'Maintenance', example: 'The elevator needed maintenance.', category: 'Intermediate' },
      { id: '58', hindi: 'सुव्यवस्था', english: 'Arrangement', example: 'Arrangements for the event were excellent.', category: 'Intermediate' },
      { id: '59', hindi: 'आरामदायक', english: 'Cozy', example: 'The room was cozy and warm.', category: 'Intermediate' },
      { id: '60', hindi: 'उपलब्धता', english: 'Availability', example: 'Room availability was limited.', category: 'Intermediate' },
      { id: '61', hindi: 'अतिथि पुस्तिका', english: 'Guest Book', example: 'Guests signed the guest book.', category: 'Intermediate' },
      { id: '62', hindi: 'समीक्षा', english: 'Review', example: 'The hotel received a positive review.', category: 'Intermediate' },
      { id: '63', hindi: 'प्रतिक्रिया', english: 'Feedback', example: 'Feedback was shared online.', category: 'Intermediate' },
      { id: '64', hindi: 'नवाचार', english: 'Innovation', example: 'Innovation improved the hospitality service.', category: 'Intermediate' },
      { id: '65', hindi: 'विस्तार', english: 'Expansion', example: 'The hotel is planning expansion.', category: 'Intermediate' },
      { id: '66', hindi: 'सुविधा प्रबंधक', english: 'Facility Manager', example: 'The facility manager supervised staff.', category: 'Intermediate' },
      { id: '67', hindi: 'नेटवर्किंग', english: 'Networking', example: 'The conference was good for networking.', category: 'Intermediate' },
      { id: '68', hindi: 'पर्यटन', english: 'Tourism', example: 'Tourism boosted local hospitality businesses.', category: 'Intermediate' },
      { id: '69', hindi: 'पंजीकरण', english: 'Registration', example: 'Online registration is required for events.', category: 'Intermediate' },
      { id: '70', hindi: 'विकल्प', english: 'Option', example: 'Guests were given multiple dining options.', category: 'Intermediate' },
      
      // Advanced Category (30 words)
      { id: '71', hindi: 'अतिथि अनुभव', english: 'Guest Experience', example: 'The hotel improved guest experience.', category: 'Advanced' },
      { id: '72', hindi: 'अतिथि संतुष्टि', english: 'Guest Satisfaction', example: 'Guest satisfaction is our priority.', category: 'Advanced' },
      { id: '73', hindi: 'गुणवत्ता नियंत्रण', english: 'Quality Control', example: 'Quality control ensured better service.', category: 'Advanced' },
      { id: '74', hindi: 'राजस्व प्रबंधन', english: 'Revenue Management', example: 'Revenue management increased profits.', category: 'Advanced' },
      { id: '75', hindi: 'डिजिटल परिवर्तन', english: 'Digital Transformation', example: 'Digital transformation enhanced operations.', category: 'Advanced' },
      { id: '76', hindi: 'डेटा विश्लेषण', english: 'Data Analytics', example: 'Data analytics improved decision making.', category: 'Advanced' },
      { id: '77', hindi: 'सामरिक योजना', english: 'Strategic Planning', example: 'Strategic planning guided hotel growth.', category: 'Advanced' },
      { id: '78', hindi: 'ग्राहक निष्ठा', english: 'Customer Loyalty', example: 'Customer loyalty programs retained guests.', category: 'Advanced' },
      { id: '79', hindi: 'ब्रांड प्रबंधन', english: 'Brand Management', example: 'Brand management built reputation.', category: 'Advanced' },
      { id: '80', hindi: 'सततता', english: 'Sustainability', example: 'Sustainability practices reduced waste.', category: 'Advanced' },
      { id: '81', hindi: 'सेवा मानक', english: 'Service Standards', example: 'Service standards were followed strictly.', category: 'Advanced' },
      { id: '82', hindi: 'परियोजना प्रबंधन', english: 'Project Management', example: 'Project management improved efficiency.', category: 'Advanced' },
      { id: '83', hindi: 'कर्मचारी संलग्नता', english: 'Employee Engagement', example: 'Employee engagement increased performance.', category: 'Advanced' },
      { id: '84', hindi: 'नवाचार रणनीति', english: 'Innovation Strategy', example: 'Innovation strategy enhanced services.', category: 'Advanced' },
      { id: '85', hindi: 'स्वचालन', english: 'Automation', example: 'Automation reduced workload.', category: 'Advanced' },
      { id: '86', hindi: 'स्वास्थ्य और सुरक्षा', english: 'Health and Safety', example: 'Health and safety are top priorities.', category: 'Advanced' },
      { id: '87', hindi: 'ग्राहक अंतर्दृष्टि', english: 'Customer Insights', example: 'Customer insights guided improvements.', category: 'Advanced' },
      { id: '88', hindi: 'डिजिटल मार्केटिंग', english: 'Digital Marketing', example: 'Digital marketing promoted the hotel.', category: 'Advanced' },
      { id: '89', hindi: 'प्रतिस्पर्धी विश्लेषण', english: 'Competitive Analysis', example: 'Competitive analysis helped planning.', category: 'Advanced' },
      { id: '90', hindi: 'सेवा उत्कृष्टता', english: 'Service Excellence', example: 'Service excellence earned recognition.', category: 'Advanced' },
      { id: '91', hindi: 'जोखिम प्रबंधन', english: 'Risk Management', example: 'Risk management reduced losses.', category: 'Advanced' },
      { id: '92', hindi: 'मानकीकरण', english: 'Standardization', example: 'Standardization improved processes.', category: 'Advanced' },
      { id: '93', hindi: 'ग्राहक यात्रा', english: 'Customer Journey', example: 'The customer journey was mapped.', category: 'Advanced' },
      { id: '94', hindi: 'कार्यबल विकास', english: 'Workforce Development', example: 'Workforce development trained staff.', category: 'Advanced' },
      { id: '95', hindi: 'आउटसोर्सिंग', english: 'Outsourcing', example: 'Outsourcing reduced costs.', category: 'Advanced' },
      { id: '96', hindi: 'डिजिटल प्लेटफॉर्म', english: 'Digital Platform', example: 'The digital platform improved booking.', category: 'Advanced' },
      { id: '97', hindi: 'कौशल विकास', english: 'Skill Development', example: 'Skill development improved efficiency.', category: 'Advanced' },
      { id: '98', hindi: 'विविधता और समावेशन', english: 'Diversity and Inclusion', example: 'Diversity improved workplace culture.', category: 'Advanced' },
      { id: '99', hindi: 'ग्राहक विभाजन', english: 'Customer Segmentation', example: 'Segmentation helped target guests.', category: 'Advanced' },
      { id: '100', hindi: 'अतिथि प्रतिधारण', english: 'Guest Retention', example: 'Guest retention strategies worked well.', category: 'Advanced' }
    ],
    healthcare: [
      // Basic Category (30 words)
      { id: '1', hindi: 'डॉक्टर', english: 'Doctor', example: 'The doctor examined the patient.', category: 'Basic' },
      { id: '2', hindi: 'नर्स', english: 'Nurse', example: 'The nurse gave the injection.', category: 'Basic' },
      { id: '3', hindi: 'मरीज़', english: 'Patient', example: 'The patient is recovering well.', category: 'Basic' },
      { id: '4', hindi: 'अस्पताल', english: 'Hospital', example: 'The hospital has modern facilities.', category: 'Basic' },
      { id: '5', hindi: 'क्लिनिक', english: 'Clinic', example: 'The clinic is open daily.', category: 'Basic' },
      { id: '6', hindi: 'दवा', english: 'Medicine', example: 'The medicine was prescribed by the doctor.', category: 'Basic' },
      { id: '7', hindi: 'फार्मेसी', english: 'Pharmacy', example: 'The pharmacy is next to the hospital.', category: 'Basic' },
      { id: '8', hindi: 'नुस्ख़ा', english: 'Prescription', example: 'The doctor wrote a prescription.', category: 'Basic' },
      { id: '9', hindi: 'इलाज', english: 'Treatment', example: 'The treatment was successful.', category: 'Basic' },
      { id: '10', hindi: 'सर्जरी', english: 'Surgery', example: 'The surgery took three hours.', category: 'Basic' },
      { id: '11', hindi: 'परीक्षण', english: 'Test', example: 'A blood test was required.', category: 'Basic' },
      { id: '12', hindi: 'रक्त', english: 'Blood', example: 'A blood sample was taken.', category: 'Basic' },
      { id: '13', hindi: 'टीका', english: 'Vaccine', example: 'The child received a vaccine.', category: 'Basic' },
      { id: '14', hindi: 'आपातकाल', english: 'Emergency', example: 'The patient was taken to emergency.', category: 'Basic' },
      { id: '15', hindi: 'एंबुलेंस', english: 'Ambulance', example: 'The ambulance arrived quickly.', category: 'Basic' },
      { id: '16', hindi: 'वार्ड', english: 'Ward', example: 'The patient was shifted to the ward.', category: 'Basic' },
      { id: '17', hindi: 'बिस्तर', english: 'Bed', example: 'The hospital bed was occupied.', category: 'Basic' },
      { id: '18', hindi: 'निदान', english: 'Diagnosis', example: 'The diagnosis confirmed the illness.', category: 'Basic' },
      { id: '19', hindi: 'स्वास्थ्य', english: 'Health', example: 'Health is wealth.', category: 'Basic' },
      { id: '20', hindi: 'चिकित्सा', english: 'Medical', example: 'Medical advice is important.', category: 'Basic' },
      { id: '21', hindi: 'ऑपरेशन', english: 'Operation', example: 'The operation was successful.', category: 'Basic' },
      { id: '22', hindi: 'थैरेपी', english: 'Therapy', example: 'The patient is undergoing therapy.', category: 'Basic' },
      { id: '23', hindi: 'संक्रमण', english: 'Infection', example: 'The infection spread quickly.', category: 'Basic' },
      { id: '24', hindi: 'सफाई', english: 'Hygiene', example: 'Hygiene is very important.', category: 'Basic' },
      { id: '25', hindi: 'वज़न', english: 'Weight', example: 'The nurse checked the patient\'s weight.', category: 'Basic' },
      { id: '26', hindi: 'तापमान', english: 'Temperature', example: 'The temperature was high.', category: 'Basic' },
      { id: '27', hindi: 'दर्द', english: 'Pain', example: 'The patient complained of pain.', category: 'Basic' },
      { id: '28', hindi: 'स्वास्थ्य जांच', english: 'Check-up', example: 'A routine check-up was scheduled.', category: 'Basic' },
      { id: '29', hindi: 'रोग', english: 'Disease', example: 'Diabetes is a common disease.', category: 'Basic' },
      { id: '30', hindi: 'कक्ष', english: 'Room', example: 'The hospital room was spacious.', category: 'Basic' },
      
      // Intermediate Category (40 words)
      { id: '31', hindi: 'विशेषज्ञ', english: 'Specialist', example: 'The patient met a heart specialist.', category: 'Intermediate' },
      { id: '32', hindi: 'परामर्श', english: 'Consultation', example: 'Consultation was scheduled for Monday.', category: 'Intermediate' },
      { id: '33', hindi: 'चिकित्सक', english: 'Physician', example: 'The physician prescribed antibiotics.', category: 'Intermediate' },
      { id: '34', hindi: 'प्रयोगशाला', english: 'Laboratory', example: 'The laboratory conducted blood tests.', category: 'Intermediate' },
      { id: '35', hindi: 'पुनर्वास', english: 'Rehabilitation', example: 'Rehabilitation helped recovery.', category: 'Intermediate' },
      { id: '36', hindi: 'देखभाल', english: 'Care', example: 'The patient needs constant care.', category: 'Intermediate' },
      { id: '37', hindi: 'बीमा', english: 'Insurance', example: 'The treatment was covered by insurance.', category: 'Intermediate' },
      { id: '38', hindi: 'रिपोर्ट', english: 'Report', example: 'The doctor reviewed the report.', category: 'Intermediate' },
      { id: '39', hindi: 'सर्जन', english: 'Surgeon', example: 'The surgeon performed the operation.', category: 'Intermediate' },
      { id: '40', hindi: 'नर्सिंग', english: 'Nursing', example: 'Nursing care was provided.', category: 'Intermediate' },
      { id: '41', hindi: 'पोषण', english: 'Nutrition', example: 'Nutrition is essential for health.', category: 'Intermediate' },
      { id: '42', hindi: 'आपरेशन थिएटर', english: 'Operation Theatre', example: 'The operation theatre was sterilized.', category: 'Intermediate' },
      { id: '43', hindi: 'प्रसूति', english: 'Maternity', example: 'She was admitted to the maternity ward.', category: 'Intermediate' },
      { id: '44', hindi: 'बाल रोग', english: 'Pediatrics', example: 'The child visited the pediatrics department.', category: 'Intermediate' },
      { id: '45', hindi: 'हृदय रोग', english: 'Cardiology', example: 'Cardiology deals with heart diseases.', category: 'Intermediate' },
      { id: '46', hindi: 'स्नायु रोग', english: 'Neurology', example: 'Neurology studies the nervous system.', category: 'Intermediate' },
      { id: '47', hindi: 'चर्म रोग', english: 'Dermatology', example: 'Dermatology treats skin problems.', category: 'Intermediate' },
      { id: '48', hindi: 'नेत्र रोग', english: 'Ophthalmology', example: 'Ophthalmology is about eye care.', category: 'Intermediate' },
      { id: '49', hindi: 'दंत चिकित्सा', english: 'Dentistry', example: 'Dentistry focuses on oral health.', category: 'Intermediate' },
      { id: '50', hindi: 'सामान्य चिकित्सा', english: 'General Medicine', example: 'General medicine treats common illnesses.', category: 'Intermediate' },
      { id: '51', hindi: 'मानसिक स्वास्थ्य', english: 'Mental Health', example: 'Mental health is equally important.', category: 'Intermediate' },
      { id: '52', hindi: 'फिजियोथेरेपी', english: 'Physiotherapy', example: 'Physiotherapy improved mobility.', category: 'Intermediate' },
      { id: '53', hindi: 'पुनर्परीक्षण', english: 'Follow-up', example: 'A follow-up visit was suggested.', category: 'Intermediate' },
      { id: '54', hindi: 'रिकॉर्ड', english: 'Record', example: 'The patient\'s record was updated.', category: 'Intermediate' },
      { id: '55', hindi: 'एंटीबायोटिक', english: 'Antibiotic', example: 'The antibiotic cured the infection.', category: 'Intermediate' },
      { id: '56', hindi: 'सुई', english: 'Injection', example: 'The injection reduced the pain.', category: 'Intermediate' },
      { id: '57', hindi: 'प्लाज़्मा', english: 'Plasma', example: 'Plasma donation saved lives.', category: 'Intermediate' },
      { id: '58', hindi: 'ऑक्सीजन', english: 'Oxygen', example: 'The patient needed oxygen support.', category: 'Intermediate' },
      { id: '59', hindi: 'वेंटिलेटर', english: 'Ventilator', example: 'The ventilator kept the patient stable.', category: 'Intermediate' },
      { id: '60', hindi: 'सर्जिकल उपकरण', english: 'Surgical Instruments', example: 'The surgical instruments were sterilized.', category: 'Intermediate' },
      { id: '61', hindi: 'रोगी देखभाल', english: 'Patient Care', example: 'Patient care was prioritized.', category: 'Intermediate' },
      { id: '62', hindi: 'प्रशिक्षण', english: 'Training', example: 'The staff received training.', category: 'Intermediate' },
      { id: '63', hindi: 'समर्थन', english: 'Support', example: 'The patient received emotional support.', category: 'Intermediate' },
      { id: '64', hindi: 'स्वास्थ्य प्रणाली', english: 'Healthcare System', example: 'The healthcare system is improving.', category: 'Intermediate' },
      { id: '65', hindi: 'लक्षण', english: 'Symptoms', example: 'The symptoms included fever and cough.', category: 'Intermediate' },
      { id: '66', hindi: 'जांच', english: 'Examination', example: 'The examination lasted 30 minutes.', category: 'Intermediate' },
      { id: '67', hindi: 'सर्जिकल टीम', english: 'Surgical Team', example: 'The surgical team worked efficiently.', category: 'Intermediate' },
      { id: '68', hindi: 'मूल्यांकन', english: 'Evaluation', example: 'The evaluation confirmed the diagnosis.', category: 'Intermediate' },
      { id: '69', hindi: 'रक्तचाप', english: 'Blood Pressure', example: 'The nurse checked blood pressure.', category: 'Intermediate' },
      { id: '70', hindi: 'समीक्षा', english: 'Review', example: 'The doctor wrote a review report.', category: 'Intermediate' },
      
      // Advanced Category (30 words)
      { id: '71', hindi: 'स्वास्थ्य बीमा', english: 'Health Insurance', example: 'Health insurance covered expenses.', category: 'Advanced' },
      { id: '72', hindi: 'चिकित्सा अनुसंधान', english: 'Medical Research', example: 'Medical research discovered new treatments.', category: 'Advanced' },
      { id: '73', hindi: 'क्लिनिकल परीक्षण', english: 'Clinical Trial', example: 'The clinical trial was successful.', category: 'Advanced' },
      { id: '74', hindi: 'स्वास्थ्य नीति', english: 'Health Policy', example: 'Health policy improved patient care.', category: 'Advanced' },
      { id: '75', hindi: 'सार्वजनिक स्वास्थ्य', english: 'Public Health', example: 'Public health campaigns saved lives.', category: 'Advanced' },
      { id: '76', hindi: 'जोखिम प्रबंधन', english: 'Risk Management', example: 'Risk management reduced hospital errors.', category: 'Advanced' },
      { id: '77', hindi: 'डिजिटल स्वास्थ्य', english: 'Digital Health', example: 'Digital health improved accessibility.', category: 'Advanced' },
      { id: '78', hindi: 'टेलीमेडिसिन', english: 'Telemedicine', example: 'Telemedicine connected patients remotely.', category: 'Advanced' },
      { id: '79', hindi: 'नैदानिक उपकरण', english: 'Diagnostic Tools', example: 'Diagnostic tools improved accuracy.', category: 'Advanced' },
      { id: '80', hindi: 'गुणवत्ता मानक', english: 'Quality Standards', example: 'Quality standards were maintained.', category: 'Advanced' },
      { id: '81', hindi: 'डेटा विश्लेषण', english: 'Data Analytics', example: 'Data analytics guided health planning.', category: 'Advanced' },
      { id: '82', hindi: 'मानव संसाधन', english: 'Human Resources', example: 'Human resources managed staff.', category: 'Advanced' },
      { id: '83', hindi: 'स्वास्थ्य सूचना प्रणाली', english: 'Health Information System', example: 'HIS stores patient records.', category: 'Advanced' },
      { id: '84', hindi: 'सर्जिकल नवाचार', english: 'Surgical Innovation', example: 'Surgical innovation reduced risks.', category: 'Advanced' },
      { id: '85', hindi: 'मरीज संतुष्टि', english: 'Patient Satisfaction', example: 'Patient satisfaction was measured.', category: 'Advanced' },
      { id: '86', hindi: 'नवाचार प्रबंधन', english: 'Innovation Management', example: 'Innovation management improved care.', category: 'Advanced' },
      { id: '87', hindi: 'मानकीकरण', english: 'Standardization', example: 'Standardization improved quality.', category: 'Advanced' },
      { id: '88', hindi: 'सततता', english: 'Sustainability', example: 'Sustainability practices reduced waste.', category: 'Advanced' },
      { id: '89', hindi: 'कार्यबल विकास', english: 'Workforce Development', example: 'Workforce development trained nurses.', category: 'Advanced' },
      { id: '90', hindi: 'ग्राहक यात्रा', english: 'Patient Journey', example: 'The patient journey was mapped.', category: 'Advanced' },
      { id: '91', hindi: 'स्वास्थ्य जागरूकता', english: 'Health Awareness', example: 'Health awareness campaigns were launched.', category: 'Advanced' },
      { id: '92', hindi: 'डिजिटल प्लेटफॉर्म', english: 'Digital Platform', example: 'The digital platform allowed e-consults.', category: 'Advanced' },
      { id: '93', hindi: 'चिकित्सा नैतिकता', english: 'Medical Ethics', example: 'Medical ethics guided decisions.', category: 'Advanced' },
      { id: '94', hindi: 'गोपनीयता', english: 'Confidentiality', example: 'Confidentiality was maintained.', category: 'Advanced' },
      { id: '95', hindi: 'क्लिनिकल गवर्नेंस', english: 'Clinical Governance', example: 'Clinical governance ensured accountability.', category: 'Advanced' },
      { id: '96', hindi: 'अनुपालन', english: 'Compliance', example: 'The hospital followed compliance rules.', category: 'Advanced' },
      { id: '97', hindi: 'ग्राहक अंतर्दृष्टि', english: 'Patient Insights', example: 'Patient insights improved healthcare.', category: 'Advanced' },
      { id: '98', hindi: 'डिजिटल परिवर्तन', english: 'Digital Transformation', example: 'Digital transformation modernized healthcare.', category: 'Advanced' },
      { id: '99', hindi: 'कौशल विकास', english: 'Skill Development', example: 'Skill development improved expertise.', category: 'Advanced' },
      { id: '100', hindi: 'अनुसंधान और विकास', english: 'Research & Development', example: 'R&D created new vaccines.', category: 'Advanced' }
    ],
    logistics: [
      // Basic Category (30 words)
      { id: '1', hindi: 'परिवहन', english: 'Transport', example: 'Transport is arranged by trucks.', category: 'Basic' },
      { id: '2', hindi: 'माल', english: 'Cargo', example: 'The cargo arrived safely.', category: 'Basic' },
      { id: '3', hindi: 'गोदाम', english: 'Warehouse', example: 'The goods were stored in the warehouse.', category: 'Basic' },
      { id: '4', hindi: 'डिलीवरी', english: 'Delivery', example: 'The delivery was completed on time.', category: 'Basic' },
      { id: '5', hindi: 'पैकेज', english: 'Package', example: 'The package was fragile.', category: 'Basic' },
      { id: '6', hindi: 'ट्रक', english: 'Truck', example: 'The truck carried heavy goods.', category: 'Basic' },
      { id: '7', hindi: 'जहाज', english: 'Ship', example: 'The ship transported containers overseas.', category: 'Basic' },
      { id: '8', hindi: 'विमान', english: 'Airplane', example: 'The airplane carried urgent cargo.', category: 'Basic' },
      { id: '9', hindi: 'ऑर्डर', english: 'Order', example: 'The customer placed an order.', category: 'Basic' },
      { id: '10', hindi: 'चालक', english: 'Driver', example: 'The driver delivered the goods.', category: 'Basic' },
      { id: '11', hindi: 'लोडिंग', english: 'Loading', example: 'Loading took two hours.', category: 'Basic' },
      { id: '12', hindi: 'अनलोडिंग', english: 'Unloading', example: 'The unloading was done carefully.', category: 'Basic' },
      { id: '13', hindi: 'समय', english: 'Time', example: 'The delivery time was fixed.', category: 'Basic' },
      { id: '14', hindi: 'रूट', english: 'Route', example: 'The truck followed a new route.', category: 'Basic' },
      { id: '15', hindi: 'सामान', english: 'Goods', example: 'The goods were packed properly.', category: 'Basic' },
      { id: '16', hindi: 'स्टॉक', english: 'Stock', example: 'The warehouse had limited stock.', category: 'Basic' },
      { id: '17', hindi: 'आपूर्ति', english: 'Supply', example: 'The supply was uninterrupted.', category: 'Basic' },
      { id: '18', hindi: 'मांग', english: 'Demand', example: 'The demand increased during holidays.', category: 'Basic' },
      { id: '19', hindi: 'पता', english: 'Address', example: 'The delivery address was incorrect.', category: 'Basic' },
      { id: '20', hindi: 'ग्राहक', english: 'Customer', example: 'The customer received the shipment.', category: 'Basic' },
      { id: '21', hindi: 'रसीद', english: 'Receipt', example: 'A receipt was given for delivery.', category: 'Basic' },
      { id: '22', hindi: 'भुगतान', english: 'Payment', example: 'Payment was done online.', category: 'Basic' },
      { id: '23', hindi: 'प्रेषण', english: 'Shipment', example: 'The shipment was delayed.', category: 'Basic' },
      { id: '24', hindi: 'कंटेनर', english: 'Container', example: 'The container was sealed properly.', category: 'Basic' },
      { id: '25', hindi: 'चालान', english: 'Invoice', example: 'The invoice was attached to the package.', category: 'Basic' },
      { id: '26', hindi: 'सड़क', english: 'Road', example: 'The road transport was smooth.', category: 'Basic' },
      { id: '27', hindi: 'रेल', english: 'Rail', example: 'The goods were sent by rail.', category: 'Basic' },
      { id: '28', hindi: 'समुद्र', english: 'Sea', example: 'The cargo was shipped by sea.', category: 'Basic' },
      { id: '29', hindi: 'वायु', english: 'Air', example: 'The goods were flown by air.', category: 'Basic' },
      { id: '30', hindi: 'सुरक्षा', english: 'Safety', example: 'Safety of goods is important.', category: 'Basic' },
      
      // Intermediate Category (40 words)
      { id: '31', hindi: 'लॉजिस्टिक्स', english: 'Logistics', example: 'Logistics connects supply and demand.', category: 'Intermediate' },
      { id: '32', hindi: 'वितरण', english: 'Distribution', example: 'The distribution network is wide.', category: 'Intermediate' },
      { id: '33', hindi: 'सप्लाई चेन', english: 'Supply Chain', example: 'The supply chain was disrupted.', category: 'Intermediate' },
      { id: '34', hindi: 'फ्रेट', english: 'Freight', example: 'Freight charges were high.', category: 'Intermediate' },
      { id: '35', hindi: 'कस्टम', english: 'Customs', example: 'The goods cleared customs.', category: 'Intermediate' },
      { id: '36', hindi: 'पोर्ट', english: 'Port', example: 'The ship reached the port.', category: 'Intermediate' },
      { id: '37', hindi: 'ट्रैकिंग', english: 'Tracking', example: 'Tracking showed shipment status.', category: 'Intermediate' },
      { id: '38', hindi: 'पैकिंग', english: 'Packing', example: 'Packing ensured product safety.', category: 'Intermediate' },
      { id: '39', hindi: 'इंवेंटरी', english: 'Inventory', example: 'Inventory was updated daily.', category: 'Intermediate' },
      { id: '40', hindi: 'सप्लायर', english: 'Supplier', example: 'The supplier shipped the order.', category: 'Intermediate' },
      { id: '41', hindi: 'खरीदार', english: 'Buyer', example: 'The buyer confirmed delivery.', category: 'Intermediate' },
      { id: '42', hindi: 'ऑपरेशंस', english: 'Operations', example: 'Logistics operations were streamlined.', category: 'Intermediate' },
      { id: '43', hindi: 'रूट योजना', english: 'Route Planning', example: 'Route planning saved fuel.', category: 'Intermediate' },
      { id: '44', hindi: 'संसाधन', english: 'Resources', example: 'Resources were managed effectively.', category: 'Intermediate' },
      { id: '45', hindi: 'नेटवर्क', english: 'Network', example: 'The logistics network is global.', category: 'Intermediate' },
      { id: '46', hindi: 'कूरियर', english: 'Courier', example: 'The courier delivered the parcel.', category: 'Intermediate' },
      { id: '47', hindi: 'समन्वय', english: 'Coordination', example: 'Coordination improved delivery speed.', category: 'Intermediate' },
      { id: '48', hindi: 'पुनः आपूर्ति', english: 'Replenishment', example: 'Stock replenishment was needed.', category: 'Intermediate' },
      { id: '49', hindi: 'समय पर', english: 'On-time', example: 'The goods arrived on-time.', category: 'Intermediate' },
      { id: '50', hindi: 'लोड क्षमता', english: 'Load Capacity', example: 'The truck reached its load capacity.', category: 'Intermediate' },
      { id: '51', hindi: 'बीमा', english: 'Insurance', example: 'Cargo insurance was purchased.', category: 'Intermediate' },
      { id: '52', hindi: 'वितरण केंद्र', english: 'Distribution Center', example: 'The distribution center is nearby.', category: 'Intermediate' },
      { id: '53', hindi: 'भंडारण', english: 'Storage', example: 'Storage facilities are available.', category: 'Intermediate' },
      { id: '54', hindi: 'प्रक्रिया', english: 'Process', example: 'The process was automated.', category: 'Intermediate' },
      { id: '55', hindi: 'प्राथमिकता', english: 'Priority', example: 'This shipment was given priority.', category: 'Intermediate' },
      { id: '56', hindi: 'समझौता', english: 'Agreement', example: 'The agreement was signed by both.', category: 'Intermediate' },
      { id: '57', hindi: 'अनुबंध', english: 'Contract', example: 'The logistics contract was finalized.', category: 'Intermediate' },
      { id: '58', hindi: 'लागत', english: 'Cost', example: 'The transport cost was reduced.', category: 'Intermediate' },
      { id: '59', hindi: 'मार्जिन', english: 'Margin', example: 'Profit margin increased with efficiency.', category: 'Intermediate' },
      { id: '60', hindi: 'विश्वसनीयता', english: 'Reliability', example: 'Reliability improved with better tracking.', category: 'Intermediate' },
      { id: '61', hindi: 'निर्यात', english: 'Export', example: 'The goods were exported to Europe.', category: 'Intermediate' },
      { id: '62', hindi: 'आयात', english: 'Import', example: 'The goods were imported from China.', category: 'Intermediate' },
      { id: '63', hindi: 'वितरक', english: 'Distributor', example: 'The distributor handled regional sales.', category: 'Intermediate' },
      { id: '64', hindi: 'रखरखाव', english: 'Maintenance', example: 'The fleet required maintenance.', category: 'Intermediate' },
      { id: '65', hindi: 'लचीला', english: 'Flexible', example: 'The system was flexible.', category: 'Intermediate' },
      { id: '66', hindi: 'समाधान', english: 'Solution', example: 'A logistics solution was provided.', category: 'Intermediate' },
      { id: '67', hindi: 'प्रबंधन', english: 'Management', example: 'Management controlled the operations.', category: 'Intermediate' },
      { id: '68', hindi: 'उत्पादकता', english: 'Productivity', example: 'Better planning improved productivity.', category: 'Intermediate' },
      { id: '69', hindi: 'समीक्षा', english: 'Review', example: 'The logistics review was positive.', category: 'Intermediate' },
      { id: '70', hindi: 'समय सीमा', english: 'Deadline', example: 'The shipment had a deadline.', category: 'Intermediate' },
      
      // Advanced Category (30 words)
      { id: '71', hindi: 'सप्लाई चेन प्रबंधन', english: 'Supply Chain Management', example: 'SCM improved efficiency.', category: 'Advanced' },
      { id: '72', hindi: 'लास्ट माइल डिलीवरी', english: 'Last Mile Delivery', example: 'Last mile delivery was optimized.', category: 'Advanced' },
      { id: '73', hindi: 'ग्लोबल सोर्सिंग', english: 'Global Sourcing', example: 'Global sourcing reduced costs.', category: 'Advanced' },
      { id: '74', hindi: 'इन्वेंटरी प्रबंधन', english: 'Inventory Management', example: 'Inventory management reduced waste.', category: 'Advanced' },
      { id: '75', hindi: 'परिवहन प्रबंधन प्रणाली', english: 'Transport Management System', example: 'TMS improved planning.', category: 'Advanced' },
      { id: '76', hindi: 'वेयरहाउस मैनेजमेंट', english: 'Warehouse Management', example: 'Warehouse management improved storage.', category: 'Advanced' },
      { id: '77', hindi: 'क्रॉस-डॉकिंग', english: 'Cross-docking', example: 'Cross-docking reduced handling time.', category: 'Advanced' },
      { id: '78', hindi: 'लीन लॉजिस्टिक्स', english: 'Lean Logistics', example: 'Lean logistics improved efficiency.', category: 'Advanced' },
      { id: '79', hindi: 'जस्ट इन टाइम', english: 'Just-in-Time', example: 'JIT reduced storage costs.', category: 'Advanced' },
      { id: '80', hindi: 'रीवर्स लॉजिस्टिक्स', english: 'Reverse Logistics', example: 'Reverse logistics managed returns.', category: 'Advanced' },
      { id: '81', hindi: 'ई-लॉजिस्टिक्स', english: 'E-Logistics', example: 'E-logistics improved tracking.', category: 'Advanced' },
      { id: '82', hindi: 'ग्रीन लॉजिस्टिक्स', english: 'Green Logistics', example: 'Green logistics reduced emissions.', category: 'Advanced' },
      { id: '83', hindi: 'नेटवर्क अनुकूलन', english: 'Network Optimization', example: 'Network optimization reduced delays.', category: 'Advanced' },
      { id: '84', hindi: 'डेटा विश्लेषण', english: 'Data Analytics', example: 'Data analytics guided logistics decisions.', category: 'Advanced' },
      { id: '85', hindi: 'सप्लाई चेन जोखिम', english: 'Supply Chain Risk', example: 'Risk management minimized disruption.', category: 'Advanced' },
      { id: '86', hindi: 'ब्लॉकचेन', english: 'Blockchain', example: 'Blockchain improved transparency.', category: 'Advanced' },
      { id: '87', hindi: 'ऑटोमेशन', english: 'Automation', example: 'Automation reduced manual errors.', category: 'Advanced' },
      { id: '88', hindi: 'रोबोटिक्स', english: 'Robotics', example: 'Robotics improved warehouse efficiency.', category: 'Advanced' },
      { id: '89', hindi: 'ड्रोन डिलीवरी', english: 'Drone Delivery', example: 'Drone delivery is the future.', category: 'Advanced' },
      { id: '90', hindi: 'कृत्रिम बुद्धिमत्ता', english: 'Artificial Intelligence', example: 'AI optimized routes.', category: 'Advanced' },
      { id: '91', hindi: 'डिजिटल ट्विन', english: 'Digital Twin', example: 'Digital twins simulated operations.', category: 'Advanced' },
      { id: '92', hindi: 'सस्टेनेबिलिटी', english: 'Sustainability', example: 'Sustainability practices were adopted.', category: 'Advanced' },
      { id: '93', hindi: 'ग्राहक अनुभव', english: 'Customer Experience', example: 'Customer experience was improved.', category: 'Advanced' },
      { id: '94', hindi: 'परियोजना प्रबंधन', english: 'Project Management', example: 'Project management reduced delays.', category: 'Advanced' },
      { id: '95', hindi: 'लागत अनुकूलन', english: 'Cost Optimization', example: 'Cost optimization improved margins.', category: 'Advanced' },
      { id: '96', hindi: 'अनुपालन', english: 'Compliance', example: 'Compliance rules were followed.', category: 'Advanced' },
      { id: '97', hindi: 'सप्लाई चेन दृश्यता', english: 'Supply Chain Visibility', example: 'Visibility improved with IoT.', category: 'Advanced' },
      { id: '98', hindi: 'डिजिटल परिवर्तन', english: 'Digital Transformation', example: 'Digital transformation modernized logistics.', category: 'Advanced' },
      { id: '99', hindi: 'मानकीकरण', english: 'Standardization', example: 'Standardization improved quality.', category: 'Advanced' },
      { id: '100', hindi: 'बिग डेटा', english: 'Big Data', example: 'Big data helped predict demand.', category: 'Advanced' }
    ]
  };

  const scenarioData: Record<string, Scenario[]> = {
    retail: [
      {
        id: 'customer-greeting',
        title: 'Customer Greeting',
        titleHindi: 'ग्राहक स्वागत',
        description: 'Learn how to greet customers professionally',
        difficulty: 'beginner',
        completed: true
      },
      {
        id: 'product-inquiry',
        title: 'Product Inquiry',
        titleHindi: 'उत्पाद पूछताछ',
        description: 'Handle customer product questions',
        difficulty: 'intermediate',
        completed: false
      },
      {
        id: 'complaint-handling',
        title: 'Complaint Handling',
        titleHindi: 'शिकायत निपटान',
        description: 'Resolve customer complaints effectively',
        difficulty: 'advanced',
        completed: false
      }
    ],
    manufacturing: [
      {
        id: 'safety-briefing',
        title: 'Safety Briefing',
        titleHindi: 'सुरक्षा ब्रीफिंग',
        description: 'Conduct safety meetings in English',
        difficulty: 'intermediate',
        completed: false
      },
      {
        id: 'quality-check',
        title: 'Quality Inspection',
        titleHindi: 'गुणवत्ता निरीक्षण',
        description: 'Report quality issues professionally',
        difficulty: 'advanced',
        completed: false
      }
    ]
  };

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setCurrentTab('vocabulary');
  };

  const handleCopyVocabulary = (item: VocabularyItem) => {
    const text = `${item.hindi} - ${item.english}${item.example ? '\nExample: ' + item.example : ''}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Vocabulary item copied to clipboard"
    });
  };

  const handleMarkProgress = (itemType: 'vocabulary' | 'scenario', itemId?: string) => {
    // Mock progress tracking - will be replaced with Supabase
    const progressKey = `beg_industry_progress_${selectedIndustry}`;
    const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    if (itemType === 'vocabulary') {
      existingProgress.vocabularyViewed = (existingProgress.vocabularyViewed || 0) + 1;
    } else if (itemId) {
      existingProgress.scenariosCompleted = existingProgress.scenariosCompleted || [];
      if (!existingProgress.scenariosCompleted.includes(itemId)) {
        existingProgress.scenariosCompleted.push(itemId);
      }
    }
    
    localStorage.setItem(progressKey, JSON.stringify(existingProgress));
    
    toast({
      title: "Progress Updated",
      description: "Your learning progress has been saved"
    });
  };

  const selectedIndustryData = industries.find(ind => ind.id === selectedIndustry);
  const allVocabulary = vocabularyData[selectedIndustry] || [];
  const currentScenarios = scenarioData[selectedIndustry] || [];

  // Filter and search vocabulary
  const filteredVocabulary = allVocabulary.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.example.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = allVocabulary.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                Industry-Specific Learning
              </h1>
              <p className="text-muted-foreground">
                Master business English for your specific industry
              </p>
            </div>
            <HomeButton />
          </div>
        </div>

        {!selectedIndustry ? (
          /* Industry Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Card 
                key={industry.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleIndustrySelect(industry.id)}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <industry.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="flex flex-col gap-1">
                    <span>{industry.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">{industry.nameHindi}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {industry.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{industry.progress}%</span>
                    </div>
                    <Progress value={industry.progress} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{industry.vocabularyCount} words</span>
                      <span>{industry.scenarioCount} scenarios</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Industry Content */
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedIndustry('')}
              >
                ← Back to Industries
              </Button>
              
              <div className="flex items-center gap-2">
                {selectedIndustryData && <selectedIndustryData.icon className="h-6 w-6 text-primary" />}
                <h2 className="text-xl font-semibold">{selectedIndustryData!.name}</h2>
                <span className="text-muted-foreground">({selectedIndustryData!.nameHindi})</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={currentTab === 'vocabulary' ? 'default' : 'outline'}
                onClick={() => setCurrentTab('vocabulary')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Vocabulary
              </Button>
              <Button
                variant={currentTab === 'scenarios' ? 'default' : 'outline'}
                onClick={() => setCurrentTab('scenarios')}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Scenarios
              </Button>
            </div>

            {currentTab === 'vocabulary' ? (
              /* Vocabulary Section */
              <div>
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vocabulary..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories ({allVocabulary.length})</SelectItem>
                      <SelectItem value="Basic">Basic ({categoryCounts.Basic || 0})</SelectItem>
                      <SelectItem value="Intermediate">Intermediate ({categoryCounts.Intermediate || 0})</SelectItem>
                      <SelectItem value="Advanced">Advanced ({categoryCounts.Advanced || 0})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vocabulary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVocabulary.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{item.hindi}</h3>
                              <Badge 
                                variant={item.category === 'Basic' ? 'secondary' : 
                                       item.category === 'Intermediate' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {item.category}
                              </Badge>
                            </div>
                            <p className="text-primary font-medium">{item.english}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyVocabulary(item)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-3 p-2 bg-accent/20 rounded text-sm">
                          <strong>Example:</strong> {item.example}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => handleMarkProgress('vocabulary')}
                        >
                          Mark as Learned
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filteredVocabulary.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No vocabulary items found for your search criteria.
                  </div>
                )}
              </div>
            ) : (
              /* Scenarios Section */
              <div className="space-y-4">
                {currentScenarios.map((scenario) => (
                  <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{scenario.title}</h3>
                            <span className="text-sm text-muted-foreground">({scenario.titleHindi})</span>
                            <Badge 
                              variant={scenario.difficulty === 'beginner' ? 'secondary' : 
                                     scenario.difficulty === 'intermediate' ? 'default' : 'destructive'}
                            >
                              {scenario.difficulty}
                            </Badge>
                            {scenario.completed && (
                              <CheckCircle className="h-5 w-5 text-success" />
                            )}
                          </div>
                          <p className="text-muted-foreground mb-4">{scenario.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => toast({ title: "Coming Soon", description: "Practice scenarios will be available in the next update" })}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Practice
                        </Button>
                        
                        <Button 
                          variant="ghost"
                          onClick={() => handleMarkProgress('scenario', scenario.id)}
                          disabled={scenario.completed}
                        >
                          {scenario.completed ? 'Completed' : 'Mark Complete'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}