import Foundation
import PDFKit
import AppKit
let root = URL(fileURLWithPath: CommandLine.arguments[1])
var report: [[String: Any]] = []
for case let file as URL in FileManager.default.enumerator(at: root, includingPropertiesForKeys: nil)! where file.pathExtension == "pdf" {
  guard let pdf = PDFDocument(url: file), pdf.pageCount == 1, let page = pdf.page(at: 0), let text = pdf.string, text.replacingOccurrences(of: "\n", with: "").contains("$945.18") else { fatalError("Print validation failed: \(file.lastPathComponent)") }
  report.append(["file": file.path.replacingOccurrences(of: root.path + "/", with: ""), "pages": pdf.pageCount, "width": page.bounds(for: .mediaBox).width, "height": page.bounds(for: .mediaBox).height, "total": "$945.18"])
  if file.path.contains("/db/_dashboard_invoice-light-desktop-interactive-print.pdf") {
    let image = page.thumbnail(of: NSSize(width: 850, height: 1100), for: .mediaBox)
    let bitmap = NSBitmapImageRep(data: image.tiffRepresentation!)!
    try bitmap.representation(using: .png, properties: [:])!.write(to: root.appendingPathComponent("print-render.png"))
  }
}
try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys]).write(to: root.appendingPathComponent("print-check.json"))
print("PASS \(report.count) single-page prints with matching totals")
